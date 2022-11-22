import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectManagerService, ProjectOutput } from '../../backend-services/project-manager.service';
import { ParametersManagerService, GlobalParameter } from '../../backend-services/parameters-manager.service';
import { TaskManagerService, TaskState, DefaultTaskState } from '../../backend-services/task-manager.service';
import { GlobalParameterOutput } from '../../backend-services/parameters-manager.service';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericConversion } from '../converter-common';

import * as FileSaver from "file-saver";

import { ScorePrinterComponent } from 'src/app/score-printer/score-printer.component';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent extends GenericConversion implements OnInit {
  ProjectNameForm = this.formBuilder.group({
    name: ['', Validators.required]
  });
  ProjectNameMatchInputForm:boolean = true;
  @ViewChild(ScorePrinterComponent) childScore:ScorePrinterComponent;

  constructor(public parametersManager: ParametersManagerService,
              public projectManager: ProjectManagerService,
              public formBuilder: FormBuilder,
              public taskManager: TaskManagerService,
              public route: ActivatedRoute,
              private router: Router){
    super("direct",
          parametersManager,
          projectManager,
          formBuilder,
          taskManager,
          route);
  }
  
  ngOnInit() {

  }

  projectnamechange(event:any) {
    console.log(event.target.value);
    if(event.target.value === this.project.name){
      this.ProjectNameMatchInputForm = true;
    }
    else {
      this.ProjectNameMatchInputForm = false;
    }
  }

  deleteProject(){
    this.projectManager.delete_project(this.id_project)
      .subscribe(
        task_id => {this.deleteProjectSuccessPath();},
        error => {console.log("Failed to delete project")}
      );
  }
  deleteProjectSuccessPath(){
    if(this.project.task_id != ""){
      this.taskManager.removeTaskToFollow(this.project.task_id);
    }
    this.router.navigate(['/converter']);
  }
  onSubmitNewProjectName(){
    this.projectManager.put_project(this.id_project,this.ProjectNameForm.value).subscribe();
  }

  projectActualizedAction(){
    if(this.project.state >= 3){
      this.projectManager.download_musicxml(this.id_project).subscribe(
        data => this.childScore.ShowScore(data)
      );
    }
  }

  download_AUDIO() {
    this.projectManager.download_audio(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "audio.wav")
    );
  }
  download_PITCH() {
    this.projectManager.get_pitchresult(this.id_project).subscribe(
      data => {
        let theJSON = JSON.stringify(data);
        let blob = new Blob([theJSON], { type: 'text/json' });
        FileSaver.saveAs(blob, "pitch.txt");
      }
    );
  }
  download_XML() {
    this.projectManager.download_musicxml(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score.xml")
    );
  }
  download_MIDI() {
    this.projectManager.download_midi(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score.mid")
    );
  }
  download_MIDI_NORYTHM() {
    this.projectManager.download_midinorythm(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score_norhythm.mid")
    );
  }
}
