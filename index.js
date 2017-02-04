const fs = require('fs'),
    path = require('path');
module.exports = class DB {
    constructor({ root }) {
        this.root = root;
    }

    init() {
        //1、加载数据（a 加载列表 b 加载）
        let ps = fs.readdirSync(this.root);


        //2、将数据写到本地
        let root = this.root;

        let list = ps.filter(function(p) {
            let ext = path.extname(p);
            return ext == '.list' && fs.statSync(p).isFile();
        });
        let items = ps.filter(function(p) {
            let ext = path.extname(p);
            return ext == '.item' && fs.statSync(p).isFile();
        });
        //加载列表 完成后删除对应的列表文件
        list.map(function(p) {
            let json = fs.readFileSync(p);
            let name = path.parse(p).name;
            db[name] = JSON.parse(json);
            fs.unlinkSync(p);
        });
        //加载修改记录 完成后删除对应的文件
        Promise.all(items.map(function(p) {

            let name = path.parse(p).name;

            db[name] = db[name] || {};

            let promise = new Promise(function(res, rej) {

                let reader = fs.createReadStream(p);

                reader.on('readable', function() {
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
                                delete db[name][item.__id];
                            } else {
                                db[name][item.__id] = item;
                            }
                        }
                    }
                    res(db[name]);
                    fs.unlinkSync(p);
                });
            });
            return promise;
        })).then(function(value) {
            for (var key in db) {
                if (db.hasOwnProperty(key)) {
                    var element = db[key];
                    let json = JSON.stringify(element);
                    let writer = fs.createWriteStream(path.join(root, key))
                    writer.write(new Buffer(json));
                }
            }

            console.log('数据初始化完成');
        });


    }


}

let db = {};

//1、加载数据（a 加载列表 b 加载）
let ps = fs.readdirSync(__dirname);
console.log(ps);

ps.map(function(p) {

})