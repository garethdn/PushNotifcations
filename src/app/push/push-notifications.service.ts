import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromPromise } from "rxjs/observable/fromPromise";
import { switchMap, tap } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

const VAPID_PUB_KEY = 'BGmS0CC1dDute0bRgXzjzK33-GNWJMS1UyJXA3B9l2pvEYXYuXVg1jgyxypisr7G_zt6zYWlrW-WOxs9S_3XAFg';

@Injectable()
export class PushNotificationsService {

  private _swRegistration: ServiceWorkerRegistration;
  public savedSubscriptions: { userId: number, subscription: string }[] = [];

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService) {}

  get isPushSupported(): boolean {
    return ('serviceWorker' in navigator) && ('PushManager' in window);
  }

  getActiveSubscription(): Observable<PushSubscription> {
    return this._registerServiceWorker()
      .pipe(
        switchMap(registration => fromPromise(this._swRegistration.pushManager.getSubscription()))
      )
  }

  subscribe(): Observable<PushSubscription> {
    const applicationServerKey = this._urlB64ToUint8Array(VAPID_PUB_KEY);
    const prom = this._swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    return fromPromise(prom).pipe(
      tap(sub => this.savedSubscriptions.push({
        userId: this._authService.user.id,
        subscription: JSON.stringify(sub)
      })),
      tap(sub => {
        console.log(this.savedSubscriptions)
      }))
  }

  unsubscribe(): Observable<boolean> {
    return this.getActiveSubscription().pipe(
      switchMap(sub => fromPromise(sub.unsubscribe()))
    )
  }

  getSavedSubscriptions(): Observable<{ userId: number, subscription: string }[]> {
    return this._http.get<{ userId: number, subscription: string }[]>('/push-subscriptions')
      .pipe(
        tap(subs => this.savedSubscriptions = subs)
      );
  }

  saveSubscription(sub: PushSubscription): Observable<any> {
    return this._http.post('/push-subscriptions', {
      userId: this._authService.user.id,
      subscription: JSON.stringify(sub)
    });
  }

  deleteSubscription(sub: PushSubscription): Observable<any> {
    return this._http.delete('/push-subscriptions');
  }

  notifyUsers(userIds: number[], payload: PushPayload) {
    return this._http.post<{ sent: number, failed: number }>('/users/notify', { userIds, payload });
  }

  notifyTeams(teamIds: number[], payload: PushPayload) {
    return this._http.post<{ sent: number, failed: number }>('/users/teams/notify', { teamIds, payload });
  }

  private _registerServiceWorker(): Observable<ServiceWorkerRegistration> {
    return fromPromise(navigator.serviceWorker.register('push-notifications.sw.js'))
      .pipe(
        tap(registration => {
          console.log('Service worker successfully registered.');
          this._swRegistration = registration;
        }),
      );
  }

  private _urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

}

interface PushPayload {
  messageTitle: string
  message: string
  messageTypeId: number
  image: string
}
