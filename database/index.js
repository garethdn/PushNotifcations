let Datastore = require('nedb');
let path = require('path');

let db = {};
let usersDb = new Datastore({
    filename: path.join(__dirname, 'users.db'),
    autoload: true
});

let userDeviceSubscriptionsDb = new Datastore({
    filename: path.join(__dirname, 'user-device-subscriptions.db'),
    autoload: true
});

db.users = usersDb;
db.userDeviceSubscriptions = userDeviceSubscriptionsDb;

module.exports = db;