import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConverterRoutingModule } from './converter-routing.module';

import { ConverterComponent } from './converter.component';
import { ParametersComponent } from './parameters/parameters.component';
import { ProjectComponent } from './project/project.component';
import { CreateComponent } from './project/create/create.component';
import { AdvancedConverterComponent } from './project/advanced-converter/advanced-converter.component';
import { Step1Component } from './project/advanced-converter/step1/step1.component';
import { Step2Component } from './project/advanced-converter/step2/step2.component';
import { Step3Component } from './project/advanced-converter/step3/step3.component';

import { ProjectGuardService } from '../backend-services/project-manager.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { PitchParametersComponent } from 'src/app/pitch-parameters/pitch-parameters.component';
import { StepParametersComponent } from 'src/app/step-parameters/step-parameters.component';
import { RhythmParametersComponent } from 'src/app/rhythm-parameters/rhythm-parameters.component';
import { ScorePrinterComponent } from 'src/app/score-printer/score-printer.component';

@NgModule({
  declarations: [
    ConverterComponent, 
    ParametersComponent, 
    ProjectComponent, 
    CreateComponent, 
    AdvancedConverterComponent, 
    Step1Component, 
    Step2Component, 
    Step3Component,
    PitchParametersComponent,
    StepParametersComponent,
    RhythmParametersComponent,
    ScorePrinterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ProgressbarModule.forRoot(),
    ReactiveFormsModule,
    ConverterRoutingModule,
  ],
  providers: [
    ProjectGuardService,
  ]
})
export class ConverterModule { }
