import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from '../push/push-notifications.service';
import { tap, switchMap } from 'rxjs/operators';
import { Toaster } from 'nw-style-guide/toasts';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {

  public title: string = 'Status';
  public isPushSupported: boolean = false;
  public isUserSubscribed: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private _pushService: PushNotificationsService,
    private _toaster: Toaster) {
    this.isPushSupported = this._pushService.isPushSupported;

    this.checkIfUserIsSubscribed();

    if (this.isPushSupported) {
      console.log('Push supported');
    }
    else {
      console.log('Push NOT supported');
    }
  }

  checkIfUserIsSubscribed() {
    this.isLoading = true;

    if (this.isPushSupported) {
      setTimeout(() => {
        this._pushService.getActiveSubscription()
          .subscribe(subcription => {
            this.isUserSubscribed = subcription !== null;

            if (this.isUserSubscribed) {
              console.log('User is subscribed', subcription);
            }
            else {
              console.log('User is NOT subscribed');
            }
            this.isLoading = false;
          });
      }, 1000)
    }

  }

  enablePush() {
    this.isLoading = true;

    this._pushService.subscribe()
      .pipe(
        tap(res => {
          console.log('Subscription created!', res);
          this.isUserSubscribed = true;
          this.isLoading = false;
        }),
        switchMap(res => this._pushService.saveSubscription(res))
      )
      .subscribe(res => {
        console.log(res);
        this._toaster.success('Push enabled!');
      }, err => {
        if (Notification['permission'] === "denied") {
          this._toaster.error('You have blocked push notifications');
        }
        else {
          this._toaster.error(err.message);
        }
      })
  }

  disablePush() {
    this.isLoading = true;

    this._pushService.unsubscribe().subscribe(res => {
      console.log('Subscription destroyed!');
      this.isUserSubscribed = false;
      this.isLoading = false;
    })
  }

  testMessage(message: string) {
    this._pushService.getActiveSubscription()
      .pipe(switchMap(sub => this._pushService.testMessage(sub, message)))
      .subscribe(res => {
        console.log(res);
      })
  }

}
