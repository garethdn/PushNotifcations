var db = require('../database');
var webpush = require('web-push');

var from = require("rxjs/observable/from").from;
var of = require("rxjs/observable/of").of;
var forkJoin = require("rxjs/observable/forkJoin").forkJoin;
var catchError = require("rxjs/operators").catchError;
var switchMap = require("rxjs/operators").switchMap;
var map = require("rxjs/operators").map;
var tap = require("rxjs/operators").tap;

var credentials = {
    "subject": "mailto:gareth.nolan@newswhip.com",
    "publicKey": "BGmS0CC1dDute0bRgXzjzK33-GNWJMS1UyJXA3B9l2pvEYXYuXVg1jgyxypisr7G_zt6zYWlrW-WOxs9S_3XAFg",
    "privateKey": "YLvGc_FPU7zjiGrDQLfyFP8MF3BJ8ePaA2ILLouPiFA"
};

module.exports = {

    notifySubscriptions(userDeviceSubs, data) {
        const options = {
            vapidDetails: {
                subject: credentials.subject,
                publicKey: credentials.publicKey,
                privateKey: credentials.privateKey
            },
            TTL: 10,
            contentEncoding: 'aes128gcm'
        }

        return forkJoin(userDeviceSubs.map(uds => {
            return this.sendMessage(uds, data).pipe(
                catchError(e => {
                    console.log(e);
                    return of(1);
                })
            );
        }));
    },

    sendMessage(userDeviceSub, data) {
        const options = {
            vapidDetails: {
                subject: credentials.subject,
                publicKey: credentials.publicKey,
                privateKey: credentials.privateKey
            },
            TTL: 10,
            contentEncoding: 'aes128gcm'
        };

        return from(webpush.sendNotification(
            JSON.parse(userDeviceSub.subscription),
            JSON.stringify(data),
            options
        )).pipe(
            catchError(e => {
                // If status code start with 4 delete the push subscription
                if (e.statusCode.toString().startsWith('4')) {
                    this.deleteSubscription(userDeviceSub._id).subscribe(res => {
                        console.log('Deleted subscription with id', userDeviceSub._id);
                    })
                }

                return of({
                    body: e.body,
                    statusCode: e.statusCode
                });
            })
        );
    },

    getUserDeviceSubscriptionsByUserIds(userIds) {
        return from(new Promise((resolve, reject) => {
            db.userDeviceSubscriptions.find({ userId: { $in: userIds } }, (err, docs) => {
                if (!err) {
                    return resolve(docs);
                }
                reject();
            });
        }))
    },

    getUserDeviceSubscriptionsByTeamIds(teamsIds) {
        let users = this.getUsersByTeamIds(teamsIds);
        let userDeviceSubscriptions = from(new Promise((resolve, reject) => {
            db.userDeviceSubscriptions.find({ teamId: { $in: teamsIds } }, (err, docs) => {
                if (!err) {
                    return resolve(docs);
                }
                reject();
            });
        }))

        return users.pipe(
            map(users => users.map(u => u.id)),
            switchMap(userIds => this.getUserDeviceSubscriptionsByUserIds(userIds))
        )
    },

    getUsersByTeamIds(teamIds) {
        return from(new Promise((resolve, reject) => {
            db.users.find({ teamId: { $in: teamIds } }, (err, docs) => {
                if (!err) {
                    return resolve(docs);
                }
                reject();
            });
        }))
    },

    saveSubscription(userId, subscription) {
        let doc = { userId, subscription };

        return from(new Promise((resolve, reject) => {
            db.userDeviceSubscriptions.insert(doc, function (err, newDoc) {
                if (!err) {
                    return resolve(newDoc._id);
                }
                reject();
            })
        }))
    },

    deleteSubscription(subscriptionId) {
        return from(new Promise((resolve, reject) => {
            db.userDeviceSubscriptions.remove({ _id: subscriptionId }, (err, numRemoved) => {
                if (!err) {
                    return resolve();
                }
                reject();
            })
        }))
    }

}