import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorderComponent } from 'src/app/recorder/recorder.component';
import { ProgressionBarComponent } from 'src/app/progression-bar/progression-bar.component';
import { FileInputComponent } from 'src/app/file-input/file-input.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [
    RecorderComponent,
    ProgressionBarComponent,
    FileInputComponent
  ],
  exports: [
      RecorderComponent,
      ProgressionBarComponent,
      FileInputComponent
  ],
  imports: [
    CommonModule,
    ProgressbarModule.forRoot(),
  ]
})
export class SharedModule { }
