import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromPromise } from "rxjs/observable/fromPromise";
import { switchMap } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication/authentication.service';

const VAPID_PUB_KEY = 'BGmS0CC1dDute0bRgXzjzK33-GNWJMS1UyJXA3B9l2pvEYXYuXVg1jgyxypisr7G_zt6zYWlrW-WOxs9S_3XAFg';

@Injectable()
export class PushNotificationsService {

  private _swRegistration: ServiceWorkerRegistration;

  constructor(
    private _http: HttpClient,
    private _authService: AuthenticationService) {

    if (this.isPushSupported) {
      this._registerServiceWorker();
    }
  }

  get isPushSupported(): boolean {
    return ('serviceWorker' in navigator) && ('PushManager' in window);
  }

  getActiveSubscription(): Observable<PushSubscription> {
    return fromPromise(this._swRegistration.pushManager.getSubscription())
  }

  subscribe(): Observable<PushSubscription> {
    const applicationServerKey = this._urlB64ToUint8Array(VAPID_PUB_KEY);
    const prom = this._swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    return fromPromise(prom);
  }

  unsubscribe(): Observable<boolean> {
    return this.getActiveSubscription().pipe(
      switchMap(sub => fromPromise(sub.unsubscribe()))
    )
  }

  saveSubscription(sub: PushSubscription): Observable<any> {
    return this._http.post('/push-subscription', {
      userId: this._authService.user.id,
      subscription: JSON.stringify(sub)
    });
  }

  deleteSubscription(sub: PushSubscription): Observable<any> {
    return this._http.delete('/push-subscription');
  }

  testMessage(sub: PushSubscription, message: string): Observable<any> {
    return this._http.post('/message', { message, sub });
  }

  notifyUsers(userIds: number[], payload: PushPayload) {
    return this._http.post<{ sent: number, failed: number }>('/users/notify', { userIds, payload });
  }

  notifyTeams(teamIds: number[], payload: PushPayload) {
    return this._http.post<{ sent: number, failed: number }>('/users/teams/notify', { teamIds, payload });
  }

  private _registerServiceWorker(): Promise<void | ServiceWorkerRegistration> {
    return navigator.serviceWorker.register('push-notifications.sw.js')
      .then(registration => {
        console.log('Service worker successfully registered.');
        this._swRegistration = registration;
        return registration;
      })
      .catch(err => {
        console.error('Unable to register service worker.', err);
      });
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
