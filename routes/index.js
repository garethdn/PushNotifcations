var express = require('express');
var router = express.Router();
var pushService = require('../services/push.service');

var credentials = {
    "subject": "mailto:gareth.nolan@newswhip.com",
    "publicKey": "BGmS0CC1dDute0bRgXzjzK33-GNWJMS1UyJXA3B9l2pvEYXYuXVg1jgyxypisr7G_zt6zYWlrW-WOxs9S_3XAFg",
    "privateKey": "YLvGc_FPU7zjiGrDQLfyFP8MF3BJ8ePaA2ILLouPiFA"
  }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/push-subscriptions', function(req, res, next) {
  let userId = req.body.userId;
  let sub = req.body.subscription;

  pushService.saveSubscription(userId, sub).subscribe(id => {
    res.send({
      id: id
    })
  });
});

router.get('/push-subscriptions', function(req, res, next) {
  pushService.getUserDeviceSubscriptionsByUserIds([+req.headers.userid])
    .subscribe(subs => {
      res.send(subs);
    }, err => {
      console.log(err);
    });
});

module.exports = router;
