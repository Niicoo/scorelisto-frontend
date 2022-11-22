import { Component, OnInit } from '@angular/core';
import { TaskState, DefaultTaskState } from 'src/app/backend-services/task-manager.service';

@Component({
  selector: 'app-progression-bar',
  templateUrl: './progression-bar.component.html',
  styleUrls: ['./progression-bar.component.css']
})
export class ProgressionBarComponent implements OnInit {
  task:TaskState = DefaultTaskState;

  constructor() { }

  ngOnInit() {
  }

}
