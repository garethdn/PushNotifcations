import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { AppRoutingModule, AuthRouteGuard } from './/app-routing.module';
import { UsersService } from './users/users.service';
import { HttpClientModule } from '@angular/common/http';
import { PushNotificationsService } from './push/push-notifications.service';
import { StatusComponent } from './status/status.component';
import { ToastsModule } from 'nw-style-guide/toasts';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AdminComponent } from './admin/admin.component';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    StatusComponent,
    AdminComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastsModule.forRoot()
  ],
  providers: [
    UsersService,
    PushNotificationsService,
    AuthenticationService,
    AuthRouteGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
