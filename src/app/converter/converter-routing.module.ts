import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametersComponent } from './parameters/parameters.component';
import { ConverterComponent } from './converter.component';
import { ProjectComponent } from './project/project.component';
import { CreateComponent } from './project/create/create.component';
import { AdvancedConverterComponent } from './project/advanced-converter/advanced-converter.component';
import { Step1Component } from './project/advanced-converter/step1/step1.component';
import { Step2Component } from './project/advanced-converter/step2/step2.component';
import { Step3Component } from './project/advanced-converter/step3/step3.component';
import { ProjectGuardService } from '../backend-services/project-manager.service';


const routes: Routes = [
  { path: '', component: ConverterComponent },
  { path: 'parameters', component: ParametersComponent },
  { path: 'project/create', component: CreateComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'project/:id/advanced-converter', component: AdvancedConverterComponent,
    children: [
      { path: '', redirectTo: 'step1-pitchdetection', pathMatch: 'full' },
      { path: 'step1-pitchdetection', component: Step1Component },
      { path: 'step2-stepdetection', component: Step2Component, canActivate:[ProjectGuardService] },
      { path: 'step3-rythmdetection', component: Step3Component, canActivate:[ProjectGuardService] }
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConverterRoutingModule { }
