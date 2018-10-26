var express = require('express');
var router = express.Router();
var webpush = require('web-push');
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

router.post('/push-subscription', function(req, res, next) {
  let userId = req.body.userId;
  let sub = req.body.subscription;
  
  pushService.saveSubscription(userId, sub).subscribe(id => {
    res.send({
      id: id
    })
  });
});

router.post('/message', function(req, res, next) {
  const pubKey = credentials.publicKey;
  const privateKey = credentials.privateKey;

  const options = {
    vapidDetails: {
      subject: credentials.subject,
      publicKey: pubKey,
      privateKey: privateKey
    },
    TTL: 10,
    contentEncoding: 'aes128gcm'
  }

  webpush.sendNotification(
    req.body.sub,
    req.body.message,
    options
  );

  res.send({ message: 'thanks'});

});

module.exports = router;
