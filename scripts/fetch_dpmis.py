#!/usr/bin/env python3
"""Download and stage the complete public DPMIS project register as a reviewable CSV.
No guessed coordinates, budgets, contractors, or ward assignments.
Run: python scripts/fetch_dpmis.py --output data/dpmis-projects.csv
Requires: pip install requests beautifulsoup4
"""
import argparse
import csv
import re
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

URL = "https://dpmis.treasury.go.ke/projects"
FIELDS = ["external_id", "name", "county", "constituency", "ward", "category",
          "status", "allocated_budget", "progress_percent", "longitude", "latitude",
          "description", "source_url", "location_raw", "period_raw", "retrieved_at"]
CODE = re.compile(r"\b([0-9]{6})\s+(Ongoing|Completed|Stalled|Delayed)\b", re.I)
def parse_location(raw):
    raw = raw.strip()
    if not raw or raw.lower() in ("not specified", "tbd"):
        return "", "", ""
    if re.match(r"^\d+\s+counties?\b", raw, re.I):
        return "", "", ""
    parts = [p.strip().title() for p in raw.split("|")]
    return tuple((parts + ["", "", ""])[:3])

def collect():
    response = requests.get(URL, timeout=50, headers={"User-Agent": "Sentrix-public-data-import/1.0 (+https://github.com/karisajoshua/Sentrix)"})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    result = {}
    for h in soup.find_all(["h3"]):
        title = h.get_text(" ", strip=True)
        if not title:
            continue
        node = h
        card = None
        for _ in range(7):
            node = node.parent
            if node is None:
                break
            content = node.get_text(" ", strip=True)
            if CODE.search(content) and "Location" in content and "Period" in content and len(content) < 2800:
                card = node
                break
        if card is None:
            continue
        text = card.get_text(" ", strip=True)
        match = CODE.search(text)
        if not match:
            continue
        code, status = match.groups()
        def between(start, ends):
            p = re.search(r"\b" + re.escape(start) + r"\s+(.*?)\s+(?:" + "|".join(re.escape(e) for e in ends) + r")\b", text, re.I)
            return p.group(1).strip() if p else ""
        location = between("Location", ["Period", "Development Partners"])
        period = between("Period", ["Development Partners", "Public summary"])
        sector = between("Objective", ["Location", "Period"])
        if len(sector) > 150:
            sector = ""
        county, constituency, ward = parse_location(location)
        result[code] = dict(external_id="DPMIS:" + code, name=title,
            county=county, constituency=constituency, ward=ward,
            category=sector or "Unclassified", status="In progress" if status.lower()=="ongoing" else status.title(),
            allocated_budget="", progress_percent="", longitude="", latitude="",
            description="", source_url=URL, location_raw=location, period_raw=period,
            retrieved_at=datetime.now(timezone.utc).isoformat())
    return result

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--output", default="data/dpmis-projects.csv")
    p.add_argument("--min-records", type=int, default=200)
    args = p.parse_args()
    records = collect()
    if len(records) < args.min_records:
        raise SystemExit(f"Only parsed {len(records)} records; expected >= {args.min_records}. Refusing partial overwrite.")
    import os
    os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
    with open(args.output, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(records.values())
    from collections import Counter
    print({"extracted": len(records), "geolocated_to_county": sum(bool(x["county"]) for x in records.values()),
           "without_county": sum(not x["county"] for x in records.values()),
           "statuses": dict(Counter(x["status"] for x in records.values())), "output": args.output})

if __name__ == "__main__":
    main()
