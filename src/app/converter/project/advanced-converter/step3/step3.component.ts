import {
    Component,
    OnInit,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    ViewChild
} from '@angular/core';

import { GenericConversion, PitchChartOpts } from '../../../converter-common';
import { ParametersManagerService, StepParameterOutput } from 'src/app/backend-services/parameters-manager.service';
import { ProjectManagerService, ProjectOutput, StepResultOutput } from 'src/app/backend-services/project-manager.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { TaskManagerService, TaskState, DefaultTaskState } from 'src/app/backend-services/task-manager.service';
import { Subscription } from 'rxjs';

import { chart } from "highcharts";
import * as Highcharts from "highcharts";
import * as FileSaver from "file-saver";

import { RhythmParametersComponent } from 'src/app/rhythm-parameters/rhythm-parameters.component';
import { ScorePrinterComponent } from 'src/app/score-printer/score-printer.component';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component extends GenericConversion implements OnInit {
  // Pitch result
  stepresult:StepResultOutput;
  @ViewChild(RhythmParametersComponent) childParameters:RhythmParametersComponent;
  @ViewChild(ScorePrinterComponent) childScore:ScorePrinterComponent;
  
  constructor(public parametersManager: ParametersManagerService,
              public projectManager: ProjectManagerService,
              public formBuilder: FormBuilder,
              public taskManager: TaskManagerService,
              public route: ActivatedRoute){
    super("rythm",
          parametersManager,
          projectManager,
          formBuilder,
          taskManager,
          route);
  }

  ngOnInit() {
  }

  projectActualizedAction(){
    if(this.project.state >= 3){
      this.projectManager.download_musicxml(this.id_project).subscribe(
        data => this.childScore.ShowScore(data)
      );
    }
  }

  ngOnDestroy() {
  }

  download_XML() {
    this.projectManager.download_musicxml(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score_" + this.project.name + ".xml")
    );
  }

  download_MIDI() {
    this.projectManager.download_midi(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score_" + this.project.name + ".mid")
    );
  }

  download_MIDI_NORYTHM() {
    this.projectManager.download_midinorythm(this.id_project).subscribe(
      data => FileSaver.saveAs(data, "score_norhythm_" + this.project.name + ".mid")
    );
  }

}
