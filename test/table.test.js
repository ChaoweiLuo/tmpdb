const Table = require('../lib/table.js')

const path = require('path');


const assert = require('assert');


describe('table', function() {
    let tb = null;
    it('init', function(done) {
        tb = new Table({
            tableName: "test",
            root: path.join(__dirname, 'db')
        });
        done();
    });

    it('save', function(done) {

        tb.save({
            name: 'zhangsan',
            password: '123456',
            test: 'demo'
        });
        done();
    });

    it('get', function(done) {
        let items = tb.get(function(item) {
            return item.name === 'zhangsan';
        });
        assert.notEqual(items, null);
        assert.notEqual(items.length, 0)
        assert.equal(items[0].name, 'zhangsan')

        let items2 = tb.get(function(item) {
            return item.__id === '123'
        });

        assert.notEqual(items2, null);
        assert.equal(items2.length, 0);

        done();
    })

})