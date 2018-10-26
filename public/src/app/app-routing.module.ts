import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { StatusComponent } from './status/status.component';
import { AdminComponent } from './admin/admin.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationService } from './authentication/authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthRouteGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!this._authService.isAuthenticated) {
      this._router.navigate(['auth']);
    }
    return true;
  }

}

const routes: Routes = [
  { path: '', component: StatusComponent, canActivate: [AuthRouteGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthRouteGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthRouteGuard] },
  { path: 'auth', component: AuthenticationComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
