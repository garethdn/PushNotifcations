var express = require('express');
var router = express.Router();
var db = require('../database');
var pushService = require('../services/push.service');
var switchMap = require("rxjs/operators").switchMap;
var of = require("rxjs").of;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(db.users.getAllData())
});

router.post('/notify', function(req, res, next) {
  pushService.getUserDeviceSubscriptionsByUserIds(req.body.userIds)
    .pipe(
      switchMap(subs => {
        if (subs.length) {
          return pushService.notifySubscriptions(subs, req.body.payload);
        }
        return of([]);
      })
    )
    .subscribe(messages => onMessagesSent(res, messages), err => {
      console.log(err);
    });
});

router.post('/teams/notify', function(req, res, next) {
  pushService.getUserDeviceSubscriptionsByTeamIds(req.body.teamIds)
    .pipe(
      switchMap(subs => {
        if (subs.length) {
          return pushService.notifySubscriptions(subs, req.body.payload);
        }
        return of([]);
      })
    )
    .subscribe(messages => onMessagesSent(res, messages), err => {
      console.log(err);
    });
});

function onMessagesSent(res, messages) {
  res.send({
    sent: messages.filter(r => r.statusCode === 201).length,
    failed: messages.filter(r => r.statusCode.toString().startsWith('4')).length
  });
}

module.exports = router;
