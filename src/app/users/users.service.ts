import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService {

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<any>('/users')
  }

}
