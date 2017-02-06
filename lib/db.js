let Table = require('./table.js');
const fs = require('fs'),
    path = require('path');

function DB({ root }) {

    if (!(this instanceof DB)) {
        return new DB(arguments[0]);
    }

    //1、加载数据（a 加载列表 b 加载）
    let ps = fs.readdirSync(root);

    let ctx = this;
    this.datas = {};
    this.ps = [];
    this.root = root;
    /**
     * 加载所有的表
     */
    ps.map(function(p) {
        let name = path.parse(p).name;
        if (ctx.datas[name]) {
            return;
        }
        ctx.datas[name] = new Table({
            tableName: name,
            root: root
        });
        ctx.ps.push(ctx.datas[name].promise);
    });
}

DB.prototype = {
    get(name, filter) {
        if (!this.datas[name]) {
            this.datas[name] = new Table({
                tableName: name,
                root: this.root
            });
            this.ps.push(this.datas[name].promise);
        }
        return this.datas[name].get(filter);
    },
    set(name, model) {
        if (!this.datas[name]) {
            this.datas[name] = new Table({
                tableName: name,
                root: this.root
            });
            this.ps.push(this.datas[name].promise);
        }
        this.datas[name].save(model);
    }

}

module.exports = DB;