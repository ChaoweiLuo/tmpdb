const generate = require('../lib/uuid');
const assert = require('assert')

describe('UUID', function() {
    it('重复', function() {
        let list = [];
        for (var i = 0; i < 10000; i++) {
            let id = generate();
            //console.log(id)
            assert(list.indexOf(id) === -1, "生成了重复的ID");
        }
    })
});