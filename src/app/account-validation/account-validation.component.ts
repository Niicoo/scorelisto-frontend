import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountManagerService } from '../backend-services/account-manager.service';

@Component({
  selector: 'app-account-validation',
  templateUrl: './account-validation.component.html',
  styleUrls: ['./account-validation.component.css']
})
export class AccountValidationComponent implements OnInit {
  SecondsBeforeRedirecting:number;
  isValidationOk: boolean;

  constructor(  private activatedRoute: ActivatedRoute,
                private accountManager: AccountManagerService,
                private router: Router) { }

  countDown() {
    let self = this;
    this.SecondsBeforeRedirecting = this.SecondsBeforeRedirecting - 1;
    if(this.SecondsBeforeRedirecting>0){
      setTimeout(() => self.countDown.apply(this),1000);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.SecondsBeforeRedirecting = 5;
    let accountvalidationinput = {
      token : this.activatedRoute.snapshot.params['token'],
      uidb64 : this.activatedRoute.snapshot.params['uidb64']
    }
    this.accountManager.activateaccount(accountvalidationinput)
      .subscribe(
        // success path
        response => {
          this.isValidationOk = true;
          setTimeout(this.countDown.apply(this),1000);
        }, 
        // error path
        error => {
          this.isValidationOk = false;
        }
      );
  }
}
