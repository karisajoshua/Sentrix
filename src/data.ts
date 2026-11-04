export type ProjectStatus = "Stalled" | "In progress" | "Completed";
export type Project = { id: string; name: string; county: string; category: string; status: ProjectStatus; budget: number; progress: number; lng: number; lat: number; description: string; source: string };
/** DEMONSTRATION RECORDS ONLY — NOT ACTUAL GOVERNMENT PROJECTS */
export const demoProjects: Project[] = [
 {id:"demo-1",name:"Example: School Classroom Block",county:"Machakos",category:"Education",status:"Stalled",budget:25000000,progress:45,lng:37.2634,lat:-1.5177,description:"Fictional record demonstrating a delayed public project.",source:"Illustrative data"},
 {id:"demo-2",name:"Example: Water Distribution Network",county:"Nairobi",category:"Water",status:"In progress",budget:38000000,progress:67,lng:36.8219,lat:-1.2921,description:"Fictional record for mapping and filtering.",source:"Illustrative data"},
 {id:"demo-3",name:"Example: Health Centre Upgrade",county:"Kisii",category:"Health",status:"Completed",budget:12000000,progress:100,lng:34.7667,lat:-0.6817,description:"Fictional completed-project record.",source:"Illustrative data"},
 {id:"demo-4",name:"Example: Market Construction",county:"Marsabit",category:"Commerce",status:"Stalled",budget:16000000,progress:30,lng:37.9899,lat:2.3284,description:"Fictional record for geospatial testing.",source:"Illustrative data"}
];
export const statusColor: Record<ProjectStatus,string> = {Stalled:"#fb6472","In progress":"#f5b94f",Completed:"#3dd9a0"};
