import { Injectable } from '@angular/core';
import { BASE_API_URL } from './global-backend';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

import { Observable, throwError, Subject, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { GlobalParameter, PitchParameter, StepParameter, RythmParameter } from './parameters-manager.service';
// For the canActivate function
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


export interface ProjectPitchParameterInput extends PitchParameter {
  timestart_s?: number;
  timestop_s?: number;
}

// export const httpOptionsCreateProject = {
//   headers: new HttpHeaders({
//     'Content-Type':  'multipart/form-data',
//   })
// };

// Manage Project
export interface ProjectPostInput {
  name: string;
  audiofile: any;
  instrument:string;
}
export interface ProjectPutInput {
  name: string;
}
export interface ProjectOutput {
  id: number;
  name: string;
  date_created: string;
  instrument:string
  state:number;
  task_id:string;
  task_name:string;
}
export interface TaskOutProject {
  task_id:string;
}

export interface PitchResultOutput {
  pitch_st:number[];
  energy_db:number[];
  te_s: number;
  f0_hz: number;
  timestart_s: number;
  timestop_s: number;
}

export interface StepResultOutput {
  type_b:boolean[];
  length_s:number[];
  f0_hz:number[];
  pitch_st:number[];
  energy_db:number[];
  linked_b:boolean[];
  offset_s:number;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  // Manage Project URLs
  private ProjectUrl = BASE_API_URL + '/project';
  private DownloadFileUrlSuffix = '/download';
  private RunPitchDetectionUrlSuffix = '/runpitchdetection';
  private RunStepDetectionUrlSuffix = '/runstepdetection';
  private RunRythmDetectionUrlSuffix = '/runrythmdetection';
  private RunDirectConversionUrlSuffix = '/rundirectconversion';
  private RunFreeConversionUrlSuffix = '/freeconversion';
  // BehaviorSubject
  public projects = new ReplaySubject<ProjectOutput[]>(1);
  currentProjects:ProjectOutput[];

  constructor(private http: HttpClient,
              private authentication: AuthenticationService) { 
    this.authentication.loggedIn.subscribe( value => {this.LoggedInChange(value);} );
  }

  LoggedInChange(LoggedIn:boolean) {
    if(LoggedIn) {
      this.get_listprojects().subscribe();
    }
    else {
      console.log("oh non pas la");
      this.ClearProjects();
    }
  }

  ClearProjects() {
    this.projects.next([]);
    this.currentProjects = [];
  }

  updateProjectsSubject(projects:ProjectOutput[]) {
    this.projects.next(projects);
    this.currentProjects = projects;
  }

  getURLproject(id:number): string{
    return(this.ProjectUrl + "/" + id.toString());
  }

  get_project(id:number): Observable<any>{
    return this.http.get<ProjectOutput>(this.getURLproject(id))
      .pipe(
        catchError(err => {
          return throwError("Failed to get this project");
        })
      );
  }

  get_listprojects(): Observable<any> {
    return this.http.get<ProjectOutput[]>(this.ProjectUrl)
      .pipe(
        map(response => {this.updateProjectsSubject(response);}),
        catchError(err => { return throwError("Failed to get projects"); })
      );
  }

  delete_project(id:number): Observable<any>{
    return this.http.delete(this.getURLproject(id))
      .pipe(
        map(response => {this.get_listprojects().subscribe();}),
        catchError(err => { return throwError("Failed to delete this project"); })
      );
  }

  put_project(id:number, in_project:ProjectPutInput): Observable<any> {
    return this.http.put<ProjectOutput>(this.getURLproject(id),in_project)
      .pipe(
        map(response => {this.get_listprojects().subscribe();}),
        catchError(err => { return throwError("Failed to modify this project"); })
      );
  }

  post_newproject(in_project:any): Observable<any> {
    return this.http.post<ProjectOutput>(this.ProjectUrl,in_project)
      .pipe(
        map(response => {
          let NextValue = this.currentProjects.concat([response]);
          this.updateProjectsSubject(NextValue);
          return response.id;
        }),
        catchError(err => { return throwError("Failed to create new project"); })
      );
  }
  



  // Download files
  get_pitchresult(id:number): Observable<PitchResultOutput> {
    return this.http.get<PitchResultOutput>(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/pitch")
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the pitch result for this project");})
      );
  }
  get_stepresult(id:number): Observable<StepResultOutput> {
    return this.http.get<StepResultOutput>(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/step")
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the step result for this project");})
      );
  }

  download_audio(id:number): Observable<any> {
    return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/audio", {responseType: 'blob'})
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the audio file for this project");})
      );
  }
  download_midi(id:number): Observable<any> {
    return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/midi", {responseType: 'blob'})
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the midi file for this project");})
      );
  }
  download_midinorythm(id:number): Observable<any> {
    return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/midinorythm", {responseType: 'blob'})
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the midi file for this project");})
      );
  }
  download_musicxml(id:number): Observable<any> {
    return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/musicxml", {responseType: 'text'})
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to download the musicxml file for this project");})
      );
  }

  // Run conversion
  run_pitch_detection(id:number,pitchparam:ProjectPitchParameterInput): Observable<TaskOutProject>{
    return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runpitchdetection",pitchparam)
      .pipe(
        map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
        catchError(err => {return throwError("Failed to run the pitch detection");})
      );
  }

  run_step_detection(id:number,stepparam:StepParameter): Observable<TaskOutProject>{
    return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runstepdetection",stepparam)
      .pipe(
        map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
        catchError(err => {return throwError("Failed to run the step detection");})
      );
  }

  run_rythm_detection(id:number,rythmparam:RythmParameter): Observable<TaskOutProject>{
    return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runrythmdetection",rythmparam)
      .pipe(
        map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
        catchError(err => {return throwError("Failed to run the rythm detection");})
      );
  }

  run_direct_conversion(id:number,globalparam:GlobalParameter): Observable<TaskOutProject>{
    return this.http.post<TaskOutProject>(this.getURLproject(id) + "/rundirectconversion",globalparam)
      .pipe(
        map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
        catchError(err => {return throwError("Failed to run the direct conversion");})
      );
  }
  run_free_conversion(input_freeconverter): Observable<TaskOutProject>{
    return this.http.post<TaskOutProject>(this.ProjectUrl + this.RunFreeConversionUrlSuffix ,input_freeconverter)
      .pipe(
        map(TaskInOut => {return TaskInOut;}),
        catchError(err => {return throwError("Failed to run the direct conversion");})
      );
  }
}



@Injectable()
export class ProjectGuardService implements CanActivate {
  projects:ProjectOutput[] = null;

  constructor( public router: Router, private projectManager: ProjectManagerService) {
    this.projectManager.projects.subscribe( value => {this.projects = value;});
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Get Id of the project requested
    let id = Number(route.parent.paramMap.get('id'));
    // In case the project have not been loaded yet
    if(this.projects == null){
      this.router.navigate(['converter']);
      return false;
    }
    // Search for the corresponding project
    let project =  this.projects.find(x => x.id == id);
    // If the project does not exists
    if(project == null){
      this.router.navigate(['converter']);
      return false;
    }
    let state_min:number = 10;
    if(route.routeConfig.path === 'step1-pitchdetection'){
      state_min = 0;
    }
    if(route.routeConfig.path === 'step2-stepdetection'){
      state_min = 1;
    }
    if(route.routeConfig.path === 'step3-rythmdetection'){
      state_min = 2;
    }
    if(project.state >= state_min){
      return true;
    }
    return false;
  }
}


// FileSaver.saveAs("https://httpbin.org/image", "image.jpg");



//     let blob = new Blob([document.getElementById('exportDiv').innerHTML], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
//         });
//     FileSaver.saveAs(blob, "export.xls");    


// download_pitch(id:number): Observable<Blob> {
//   return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/pitch")
//       .map(res => res.blob())
// }





// downloadFile(id): Observable<Blob> {
//     let options = new RequestOptions({responseType: ResponseContentType.Blob });
//     return this.http.get(this._baseUrl + '/' + id, options)
//         .map(res => res.blob())
//         .catch(this.handleError)
// }



// this._reportService.getReport().subscribe(data => this.downloadFile(data)),//console.log(data),
//                  error => console.log('Error downloading the file.'),
//                  () => console.info('OK');



// downloadFile(data: Response) {
//   const blob = new Blob([data], { type: 'text/csv' });
//   const url = window.URL.createObjectURL(blob);
//   window.open(url);
// }

















// @Injectable()
// export class ProjectGuardService implements CanActivate {
//   projects:ProjectOutput[];

//   constructor( public router: Router, private projectManager: ProjectManagerService) {
//     this.projectManager.projects.subscribe( value => {this.projects = value;});
//   }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     let id = Number(route.parent.paramMap.get('id'));

//     let project = this.projectManager.get_project(id).toPromise();
//     let project =  this.projects.find(x => x.id == id);

//     if(project == null){
//       return false;
//     }
//     let state_min:number = 10;
//     if(route.routeConfig.path === 'step1-pitchdetection'){
//       state_min = 0;
//     }
//     if(route.routeConfig.path === 'step2-stepdetection'){
//       state_min = 1;
//     }
//     if(route.routeConfig.path === 'step3-rythmdetection'){
//       state_min = 2;
//     }
//     if(project.state >= state_min){
//       return true;
//     }
//     return false;
//   }
// }



// import { Injectable } from '@angular/core';
// import { BASE_API_URL } from './global-backend';
// import { HttpHeaders } from '@angular/common/http';
// import { HttpClient } from '@angular/common/http';
// import { AuthenticationService } from './authentication.service';
// import { Observable, throwError, Subject, BehaviourSubject } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { GlobalParameter, PitchParameter, StepParameter, RythmParameter } from './parameters-manager.service';
// // For the canActivate function
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


// export interface ProjectPitchParameterInput extends PitchParameter {
//   timestart_s?: number;
//   timestop_s?: number;
// }

// // export const httpOptionsCreateProject = {
// //   headers: new HttpHeaders({
// //     'Content-Type':  'multipart/form-data',
// //   })
// // };

// // Manage Project
// export interface ProjectPostInput {
//   name: string;
//   audiofile: any;
//   instrument:string;
// }
// export interface ProjectPutInput {
//   name: string;
// }
// export interface ProjectOutput {
//   id: number;
//   name: string;
//   date_created: string;
//   instrument:string
//   state:number;
//   task_id:string;
//   task_name:string;
// }
// export interface TaskOutProject {
//   task_id:string;
// }

// export interface PitchResultOutput {
//   pitch_st:number[];
//   energy_db:number[];
//   te_s: number;
//   f0_hz: number;
//   timestart_s: number;
//   timestop_s: number;
// }

// export interface StepResultOutput {
//   type_b:boolean[];
//   length_s:number[];
//   f0_hz:number[];
//   pitch_st:number[];
//   energy_db:number[];
//   linked_b:boolean[];
//   offset_s:number;
// }


// @Injectable({
//   providedIn: 'root'
// })
// export class ProjectManagerService {
//   // Manage Project URLs
//   private ProjectUrl = BASE_API_URL + '/project';
//   private DownloadFileUrlSuffix = '/download';
//   private RunPitchDetectionUrlSuffix = '/runpitchdetection';
//   private RunStepDetectionUrlSuffix = '/runstepdetection';
//   private RunRythmDetectionUrlSuffix = '/runrythmdetection';
//   private RunDirectConversionUrlSuffix = '/rundirectconversion';
//   private RunFreeConversionUrlSuffix = '/freeconversion';
//   // BehaviorSubject
//   public projects = new BehaviourSubject<ProjectOutput[]>([]);

//   constructor(private http: HttpClient,
//               private authentication: AuthenticationService) { 
//     this.authentication.loggedIn.subscribe( value => {this.LoggedInChange(value);} );
//   }

//   LoggedInChange(LoggedIn:boolean) {
//     if(LoggedIn) {
//       this.get_listprojects().subscribe();
//     }
//     else {
//       this.ClearProjects();
//     }
//   }

//   ClearProjects() {
//     this.projects.next([]);
//   }

//   getURLproject(id:number): string{
//     return(this.ProjectUrl + "/" + id.toString());
//   }

//   get_project(id:number): Observable<any>{
//     return this.http.get<ProjectOutput>(this.getURLproject(id))
//       .pipe(
//         catchError(err => {
//           return throwError("Failed to get this project");
//         })
//       );
//   }

//   get_listprojects(): Observable<any> {
//     return this.http.get<ProjectOutput[]>(this.ProjectUrl)
//       .pipe(
//         map(response => {this.projects.next(response);}),
//         catchError(err => { return throwError("Failed to get projects"); })
//       );
//   }

//   delete_project(id:number): Observable<any>{
//     return this.http.delete(this.getURLproject(id))
//       .pipe(
//         map(response => {this.get_listprojects().subscribe();}),
//         catchError(err => { return throwError("Failed to delete this project"); })
//       );
//   }

//   put_project(id:number, in_project:ProjectPutInput): Observable<any> {
//     return this.http.put<ProjectOutput>(this.getURLproject(id),in_project)
//       .pipe(
//         map(response => {this.get_listprojects().subscribe();}),
//         catchError(err => { return throwError("Failed to modify this project"); })
//       );
//   }

//   post_newproject(in_project:any): Observable<any> {
//     return this.http.post<ProjectOutput>(this.ProjectUrl,in_project)
//       .pipe(
//         map(response => {this.projects.next(this.projects.getValue().concat([response]));return response.id;}),
//         catchError(err => { return throwError("Failed to create new project"); })
//       );
//   }
  



//   // Download files
//   get_pitchresult(id:number): Observable<PitchResultOutput> {
//     return this.http.get<PitchResultOutput>(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/pitch")
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the pitch result for this project");})
//       );
//   }
//   get_stepresult(id:number): Observable<StepResultOutput> {
//     return this.http.get<StepResultOutput>(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/step")
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the step result for this project");})
//       );
//   }

//   download_audio(id:number): Observable<any> {
//     return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/audio", {responseType: 'blob'})
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the audio file for this project");})
//       );
//   }
//   download_midi(id:number): Observable<any> {
//     return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/midi", {responseType: 'blob'})
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the midi file for this project");})
//       );
//   }
//   download_midinorythm(id:number): Observable<any> {
//     return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/midinorythm", {responseType: 'blob'})
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the midi file for this project");})
//       );
//   }
//   download_musicxml(id:number): Observable<any> {
//     return this.http.get(this.getURLproject(id) + this.DownloadFileUrlSuffix + "/musicxml", {responseType: 'text'})
//       .pipe(
//         map((response) => {return response;}),
//         catchError(err => {return throwError("Failed to download the musicxml file for this project");})
//       );
//   }

//   // Run conversion
//   run_pitch_detection(id:number,pitchparam:ProjectPitchParameterInput): Observable<TaskOutProject>{
//     return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runpitchdetection",pitchparam)
//       .pipe(
//         map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
//         catchError(err => {return throwError("Failed to run the pitch detection");})
//       );
//   }

//   run_step_detection(id:number,stepparam:StepParameter): Observable<TaskOutProject>{
//     return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runstepdetection",stepparam)
//       .pipe(
//         map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
//         catchError(err => {return throwError("Failed to run the step detection");})
//       );
//   }

//   run_rythm_detection(id:number,rythmparam:RythmParameter): Observable<TaskOutProject>{
//     return this.http.post<TaskOutProject>(this.getURLproject(id) + "/runrythmdetection",rythmparam)
//       .pipe(
//         map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
//         catchError(err => {return throwError("Failed to run the rythm detection");})
//       );
//   }

//   run_direct_conversion(id:number,globalparam:GlobalParameter): Observable<TaskOutProject>{
//     return this.http.post<TaskOutProject>(this.getURLproject(id) + "/rundirectconversion",globalparam)
//       .pipe(
//         map(TaskInOut => {this.get_listprojects().subscribe();return TaskInOut;}),
//         catchError(err => {return throwError("Failed to run the direct conversion");})
//       );
//   }
//   run_free_conversion(input_freeconverter): Observable<TaskOutProject>{
//     return this.http.post<TaskOutProject>(this.ProjectUrl + this.RunFreeConversionUrlSuffix ,input_freeconverter)
//       .pipe(
//         map(TaskInOut => {return TaskInOut;}),
//         catchError(err => {return throwError("Failed to run the direct conversion");})
//       );
//   }
// }
