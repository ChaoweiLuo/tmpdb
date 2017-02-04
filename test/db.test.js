const DB = require('../lib/db.js');

let db = new DB({
    root: __dirname + "/db"
});

db.set('user', {
    name: 'admin2',
    password: '123456'
});