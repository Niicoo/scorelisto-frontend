import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { AccountValidationComponent } from './account-validation/account-validation.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { AuthGuardService } from './backend-services/authentication.service';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'account-validation/:uidb64/:token', component: AccountValidationComponent },
  { path: 'set-new-password/:uidb64/:token', component: SetNewPasswordComponent },
  { path: 'account', component: AccountComponent, canActivate:[AuthGuardService]},
  { path: 'converter', loadChildren: './converter/converter.module#ConverterModule', canActivate:[AuthGuardService] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

// imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
