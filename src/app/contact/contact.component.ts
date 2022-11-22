import { Component, OnInit } from '@angular/core';
import { AccountManagerService, ContactInput } from '../backend-services/account-manager.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  ContactForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.pattern('^.{4,64}$')]
    ],
    email: ['', [
      Validators.required,
      Validators.email]
    ],
    phone: ['', [
      Validators.pattern('^.{0,100}$')]
    ],
    body: ['', [
      Validators.pattern('^[\\s\\S]{8,5000}$')]
    ],
  });
  FieldChecker: string = "";
  WaitingForAnAnswer:boolean = false;
  MessageSent:boolean = false;
  MessageError:boolean = false;
  MessageSuccess:boolean = false;

  constructor(  private accountManager: AccountManagerService, 
                private fb: FormBuilder) { }

  ngOnInit() {
      document.getElementById("fooDiv").style.display = "none";
  }

  onSubmitContact() {
    let fieldchecker = (<HTMLInputElement>document.getElementById("foo")).value;
    this.WaitingForAnAnswer = true;
    if(fieldchecker == "") {
      this.accountManager.post_contact(this.ContactForm.value)
        .subscribe(
          // success path
          response => {
            this.ContactForm.reset();
            this.MessageSent = true;
            this.WaitingForAnAnswer = false;
            this.printSuccessMessage();
          }, 
          // error path
          error => {
            this.WaitingForAnAnswer = false;
            this.MessageSent = false;
            this.printErrorMessage();
          }
        );
    }
    else {
      // Bot detected
      this.ContactForm.reset();
    }
  }

  printErrorMessage() {
    this.MessageError = true;
    this.MessageSuccess = false;
  }
  printSuccessMessage() {
    this.MessageError = false;
    this.MessageSuccess = true;
  }
}
