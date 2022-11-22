import { Component, OnInit } from '@angular/core';
import { ProjectManagerService, ProjectOutput } from '../backend-services/project-manager.service';


@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {
  ListOfProjectsEmpty:boolean = true;
  ListOfProjects:ProjectOutput[] = [];

  constructor(public projectManager: ProjectManagerService) {
    this.projectManager.projects.subscribe( value => {this.updateProjects(value);});
  }

  ngOnInit() {
  }

  updateProjects(projects:ProjectOutput[]) {
    this.ListOfProjects = projects;
  }
}