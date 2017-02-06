const generate = require('./uuid');
const path = require('path'),
    fs = require('fs');
module.exports = class Table {
    constructor({ tableName, root, cb }) {
        this.name = tableName;
        this.data = {};
        this.path = path.join(root, tableName);
        this.itemPath = this.path + '.item';
        this.listPath = this.path + '.list';
        let ctx = this;
        this.promise = new Promise(function(res, rej) {
            ctx.initData(function() {
                res();
            })
        });
        this.promise.catch(err => {
            console.log(err);
        })
    }

    /**
     * 初始化单表数据
     */
    initData(cb) {
        let ctx = this;
        // 列表数据加载

        if (fs.existsSync(this.listPath)) {
            let listJson = fs.readFileSync(this.listPath, 'utf-8');
            this.data = JSON.parse(listJson);
            //列表初始化完成之后删除对应的列表文件
            fs.unlinkSync(this.listPath);
        }
        if (fs.existsSync(this.itemPath)) {

            new require('stream').Readable()
            let reader = fs.createReadStream(this.itemPath);

            reader.once('readable', function() {
                while (true) {
                    let chunkLen = reader.read(4);
                    if (!chunkLen) {
                        break;
                    }

                    let len = chunkLen.readUInt32LE();
                    let buf = reader.read(len);
                    let json = buf.toString('utf8');

                    let item = JSON.parse(json);
                    if (item && item.__id) {
                        if (item.__deleted) {
                            delete ctx.data[item.__id];
                        } else {
                            ctx.data[item.__id] = item;
                        }
                    }
                }
                reader.close();
                fs.unlinkSync(ctx.itemPath);
                readerCB();
            });
        } else {
            readerCB();
        }

        function readerCB() {
            let writer = fs.createWriteStream(ctx.listPath);
            let json = JSON.stringify(ctx.data);
            let buf = new Buffer(json);
            let rst = writer.write(buf, function() {
                writer.close();
            });
        }
    }

    /**
     * 保存一个新的数据
     */
    save(item) {
        if (item.__deleted && !item.__id) {
            throw new Error('试图删除一个不明确(没有__id)的项目');
        }
        //将要添加的那个id写好
        item.__id = item.__id || generate();
        this.write(item);
        this.data[item.__id] = item;
    }
    write(item) {
        let json = JSON.stringify(item);
        let buf = new Buffer(json);
        let bufLen = new Buffer(4);
        bufLen.writeInt32LE(buf.length);

        fs.appendFileSync(this.itemPath, bufLen);
        fs.appendFileSync(this.itemPath, buf);
    }

    get(filter) {
        let list = [];
        for (var key in this.data) {
            list.push(this.data[key]);
        }
        return list.filter(filter);
    }

}