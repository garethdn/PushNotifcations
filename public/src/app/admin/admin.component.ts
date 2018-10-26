import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { PushNotificationsService } from '../push/push-notifications.service';
import { Toaster } from 'nw-style-guide/toasts';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public isLoading: boolean = false;
  public users: any[] = [];
  public selectedUsers: any[] = [];
  public teamIds: number[] = [];
  public selectedTeams: number[] = [];
  public recipientType: string = "user";

  public message: string = "";
  public messageTitle: string = "Test title";
  public messageTypeId: number = 0;
  public messageImage: string = "";

  constructor(
    private _usersService: UsersService,
    private _pushService: PushNotificationsService,
    private _toaster: Toaster) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._usersService.getUsers().subscribe(res => {
      this.users = res;
      this.teamIds = Array.from(new Set(res.map(r => r.teamId))) as number[];
    })
  }

  toggleUserSelection(user: any) {
    if (this.isUserSelected(user)) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    }
    else {
      this.selectedUsers.push(user);
    }
  }

  isUserSelected(user: any): boolean {
    return this.selectedUsers.indexOf(user) > -1;
  }

  toggleTeamSelection(teamId) {
    if (this.isTeamSelected(teamId)) {
      this.selectedTeams.splice(this.selectedTeams.indexOf(teamId), 1);
    }
    else {
      this.selectedTeams.push(teamId);
    }
  }

  isTeamSelected(id) {
    return this.selectedTeams.indexOf(id) > -1;
  }

  send() {
    this._pushService.notifyUsers(this.selectedUsers.map(su => su.id), this.payload).subscribe(res => {
      this.onSendSuccess(res);
    })
  }

  sendToTeams() {
    this._pushService.notifyTeams(this.selectedTeams, this.payload).subscribe(res => {
      this.onSendSuccess(res);
    })
  }

  get payload() {
    return {
      message: this.message,
      messageTitle: this.messageTitle,
      messageTypeId: this.messageTypeId,
      image: this.messageImage
    }
  }

  onSendSuccess(res) {
    if (res.sent) {
      this._toaster.success(`${res.sent} notifications sent`);
    }

    if (res.failed) {
      this._toaster.error(`${res.failed} notifications failed`);
    }

    if (!res.sent && !res.failed) {
      this._toaster.error(`No notifications sent`);
    }
  }

}
