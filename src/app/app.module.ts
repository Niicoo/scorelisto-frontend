import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountValidationComponent } from './account-validation/account-validation.component';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpConfigInterceptor, AuthGuardService } from './backend-services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

import { AccountComponent } from './account/account.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';

// NGX BOOTSTRAP
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    PageNotFoundComponent,
    AccountValidationComponent,
    AccountComponent,
    SetNewPasswordComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    CollapseModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [  CookieService,
                AuthGuardService,
                { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
