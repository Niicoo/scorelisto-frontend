import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountManagerService, Quotas } from '../backend-services/account-manager.service';
import { AuthenticationService } from '../backend-services/authentication.service';
import { Router } from '@angular/router';
import { matchOtherValidator } from 'src/app/login/login.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  DeleteAccountForm = this.fb.group({
    password: ['', [Validators.required]]
  });
  ChangePasswordForm = this.fb.group({
    new_password: ['', [Validators.required, Validators.pattern('^.{8,32}$')]],
    new_password_check: ['', [Validators.required, matchOtherValidator('new_password')]],
    old_password: ['', [Validators.required]]
  });
  // To know which form to plot on the screen
  printChangePasswordForm:boolean = false;
  printDeleteAccountForm:boolean = false;

  // User Quotas
  userquotas:Quotas;

  constructor(  private accountManager: AccountManagerService,
                private router: Router,
                private fb: FormBuilder,
                private authentication: AuthenticationService) { 
    this.accountManager.quotas.subscribe( value => {this.userquotas = value;});
  }

  ngOnInit() {
  }

  resetForms() {
    this.ChangePasswordForm.reset();
    this.DeleteAccountForm.reset();
  }
  onClickChangePassword() {
    this.resetForms();
    this.printChangePasswordForm = true;
    this.printDeleteAccountForm = false;
  }
  onClickDeleteAccount() {
    this.resetForms();
    this.printChangePasswordForm = false;
    this.printDeleteAccountForm = true;
  }

  onSubmitChangePassword() {
    this.accountManager.updatepassword(this.ChangePasswordForm.value)
      .subscribe(
        // success path
        response => {
          console.log("password correctly changed");
          this.resetForms();
        }, 
        // error path
        error => {
          console.log(error);
        }
      );
  }

  onSubmitDeleteAccount() {
    this.accountManager.deleteuser(this.DeleteAccountForm.value)
      .subscribe(
        // success path
        response => {
          this.authentication.logout();
          this.router.navigate(['/home']);
        }, 
        // error path
        error => {
          console.log(error);
        }
      );
  }


}


