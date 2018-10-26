import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  public users: any[] = [];
  public selectedUser: any;

  constructor(
    private _usersService: UsersService,
    private _authService: AuthenticationService,
    private _router: Router) {

    this.selectedUser = this._authService.user;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._usersService.getUsers().subscribe(res => {
      this.users = res;
    })
  }

  setSelectedUser(user) {
    this.selectedUser = user;
  }

  save() {
    this._authService.setUser(this.selectedUser);
    this._router.navigate(['']);
  }

}
