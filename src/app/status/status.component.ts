import { Component } from '@angular/core';
import { PushNotificationsService } from '../push/push-notifications.service';
import { tap, switchMap } from 'rxjs/operators';
import { Toaster } from 'nw-style-guide/toasts';
import { Observable } from 'rxjs/Observable';

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
  public savedSubscriptions: { userId: number, subscription: string, _id?: string }[] = [];
  public isLoadingSavedSubscriptions: boolean;

  private _activeSubscription: PushSubscription;

  constructor(
    private _pushService: PushNotificationsService,
    private _toaster: Toaster) {

    this.isPushSupported = this._pushService.isPushSupported;

    this.checkIfUserIsSubscribed();
  }

  checkIfUserIsSubscribed() {
    this.isLoading = true;

    if (this.isPushSupported) {
      this.getActiveSubscription()
        .pipe(
          switchMap(ps => this.getSavedSubscriptions())
        )
        .subscribe();
    }
  }

  getActiveSubscription(): Observable<PushSubscription> {
    return this._pushService.getActiveSubscription().pipe(
      tap(subcription => {
        this._activeSubscription = subcription;
        this.isUserSubscribed = subcription !== null;
        this.isLoading = false;
      })
    );
  }

  getSavedSubscriptions(): Observable<{ userId: number, subscription: string }[]> {
    this.isLoadingSavedSubscriptions = true;

    return this._pushService.getSavedSubscriptions().pipe(
      tap(res => {
        this.savedSubscriptions = res;
        this.isLoadingSavedSubscriptions = false;
      })
    )
  }

  enablePush() {
    this.isLoading = true;

    this._pushService.subscribe()
      .pipe(
        tap(subscription => {
          this._activeSubscription = subscription;
          this.savedSubscriptions = this._pushService.savedSubscriptions;
          this.isUserSubscribed = true;
          this.isLoading = false;
        }),
        switchMap(res => this._pushService.saveSubscription(res))
      )
      .subscribe(res => {
        this._toaster.success('Push enabled!');
      }, err => {
        if (Notification['permission'] === "denied") {
          this._toaster.error('You have blocked push notifications');
        }
        else {
          this._toaster.error(err.message);
        }
        this.isLoading = false;
      })
  }

  disablePush() {
    this.isLoading = true;

    this._pushService.unsubscribe().subscribe(res => {
      this.isUserSubscribed = false;
      this.isLoading = false;
    })
  }

  get isThisDeviceSubscribed(): boolean {
    if (!this._activeSubscription) {
      return false;
    }

    return this.savedSubscriptions
      .filter(sub => {
        return JSON.parse(sub.subscription).endpoint === this._activeSubscription.endpoint;
      }).length > 0
  }

}
