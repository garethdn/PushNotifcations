let Datastore = require('nedb');
let path = require('path');

console.log('Intializing users')

let usersDb = new Datastore({
    filename: path.join(__dirname, 'users.db')
});

usersDb.loadDatabase();

let user1 = {
    name: 'Gareth',
    id: 1,
    teamId: 1
};

let user2 = {
    name: 'John',
    id: 2,
    teamId: 1
};

let user3 = {
    name: 'Carol',
    id: 3,
    teamId: 1
};

let user4 = {
    name: 'Maisa',
    id: 4,
    teamId: 1
};

let user5 = {
    name: 'Conor',
    id: 5,
    teamId: 1
};

let rando = {
    name: 'Karl with a "K"',
    id: 6,
    teamId: 2
};

usersDb.insert([user1, user2, user3, user4, user5, rando]);