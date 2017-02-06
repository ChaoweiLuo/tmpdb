const DB = require('../lib/db.js');
const assert = require('assert');



describe('db', function() {
    let db = new DB({
        root: __dirname + "/db"
    });
    it('初始化', function(done) {

        db.set('user', {
            name: 'zhangsan',
            __id: 1,
            password: '123456'
        });
        done();
    });

    it('get', function(done) {
        let u1 = db.get('user', function(item) {
            return item.name === 'zhangsan';
        });
        assert.notEqual(u1, null)
        assert.equal(u1.length, 1);
        assert.equal(u1[0].name, 'zhangsan');
        done();
    });
})