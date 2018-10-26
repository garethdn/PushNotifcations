import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  public isAuthenticated: boolean = false;
  public user: any;

  private _lsKey: string = 'dummyUser';

  constructor() {
    let userString = localStorage.getItem(this._lsKey);

    this.user = userString ? JSON.parse(localStorage.getItem(this._lsKey)) : null;
    this.isAuthenticated = this.user !== null;
  }

  setUser(user) {
    localStorage.setItem(this._lsKey, JSON.stringify(user));
    this.user = user;
    this.isAuthenticated = true;
  }

}
