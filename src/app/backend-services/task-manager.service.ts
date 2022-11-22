import { Injectable } from '@angular/core';
import { BASE_API_URL, httpOptions } from './global-backend';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ProjectManagerService } from 'src/app/backend-services/project-manager.service';


export interface TaskState {
  status: string;
  progression: number;
  total: number;
  substepname: string;
  mainstepname: string;
}


export interface CheckTaskIn {
  task_ids: string[];
}
export interface CheckTaskOut {
  [task_id: string]: TaskState; 
}

export const DefaultTaskState:TaskState = {
  status: "",
  progression: 0,
  total: 0,
  substepname: "",
  mainstepname: ""
}


@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  // Manage Task URLs
  private CheckTaskStateUrl = BASE_API_URL +'/project/task/checkstate';
  private RevokeTaskStateUrl = BASE_API_URL +'/project/task/revoke';
  // BehaviorSubject
  //task_ids:string[] = []
  // Interval for sending request to follow tasks
  interval = null;
  interval_ms:number = 1000
  //public tasks = new BehaviorSubject<TaskStateOutput[]>([]);

  
  tasks: { [task_id: string]: BehaviorSubject<TaskState>; } = { };
  IsFreetasks: { [task_id: string]: boolean; } = { };


  constructor(private http: HttpClient,
              public projectManager: ProjectManagerService) { }

  isTaskFollowed(task_id:string){
    return(task_id in this.tasks)
  }
  getNumberOfTaskFollowed(){
    return(Object.keys(this.tasks).length)
  }
  // Adding a new task to follow
  addTaskToFollow(task_id:string, freeTask:boolean = false){
    if(!this.isTaskFollowed(task_id)) {
      this.tasks[task_id] = new BehaviorSubject<TaskState>(DefaultTaskState);
      this.IsFreetasks[task_id] = freeTask;
      if(this.getNumberOfTaskFollowed() === 1){
        this.startTimer();
      }
    }
  }
  removeTaskToFollow(task_id:string){
    if(this.isTaskFollowed(task_id)) {
      delete this.tasks[task_id]
      delete this.IsFreetasks[task_id]
      if(this.getNumberOfTaskFollowed() === 0){
        this.stopTimer();
      }
    }
  }

  startTimer(){
    let self = this;
    this.interval = setInterval(() => self.updateTasksStates.apply(this),self.interval_ms);
  }

  stopTimer(){
    clearInterval(this.interval);
  }

  updateTasksStates(){
    let ids = Object.keys(this.tasks)
    this.post_checktask({task_ids: ids})
      .subscribe(
        states => {this.updateTaskState(states);},
        error => {console.log("Failed to check state of tasks:" + ids)}
      );
  }
  updateTaskState(states:CheckTaskOut){
    let TasksFinished:boolean = false;
    for (let task_id in states){
      if(this.isTaskFollowed(task_id)){
        this.tasks[task_id].next(states[task_id]);
        // We remove the task to be followed if it's finished
        if((states[task_id].status == "SUCCESS") || (states[task_id].status == "FAILURE")){
          this.removeTaskToFollow(task_id);
          if(!this.IsFreetasks[task_id]){
            TasksFinished = true;
          }
        }
      }
    }
    if(TasksFinished){
      this.projectManager.get_listprojects().subscribe();
    }
  }



  // Check task state
  post_checktask(input_tasks:CheckTaskIn){
    return this.http.post<CheckTaskOut>(this.CheckTaskStateUrl, input_tasks)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to get task state");})
      );
  }

  post_revoketask(task_id:string){
    return this.http.get(this.RevokeTaskStateUrl + "/" + task_id)
      .pipe(
        map((response) => {return response;}),
        catchError(err => {return throwError("Failed to revoke state");})
      );
  }
}


// export interface TaskDico {
//   task_id:string;
//   state:BehaviorSubject<TaskStateOutput>;
// }
// tasks:TaskDico[] = [];


//   isTaskFollowed(task_id:string){
//     let task = this.tasks.find(x => x.task_id == task_id);
//     return(task != null);
//   }

//   // Adding a new task to follow
//   addTaskToFollow(input_task:TaskInOut){
//     if(!this.isTaskFollowed(input_task.task_id)) {
//       let tempTask = new BehaviorSubject<TaskStateOutput>(DefaultTaskState);
//       this.tasks.push({task_id:input_task.task_id, state:tempTask})
//       if(this.tasks.length === 1){
//         this.startTimer();
//       }
//     }
//   }
//   removeTaskToFollow(input_task:TaskInOut){
//     if(this.isTaskFollowed(input_task.task_id)) {
//       let indexToRemove = this.tasks.findIndex(x => x.task_id == input_task.task_id);
//       this.tasks.splice(indexToRemove, 1);
//       if(this.tasks.length === 0){
//         this.stopTimer();
//       }
//     }
//   }