const fs = require('fs'),
    path = require('path');

let reader = fs.createReadStream(path.join(__dirname, 'tmp.txt'))

reader.on('readable', function() {
    while (true) {
        let chunkLen = reader.read(4);
        if (!chunkLen) {
            break;
        }

        let len = chunkLen.readUInt32LE();
        let buf = reader.read(len);
        let json = buf.toString('utf8');

        console.log(json);
    }
})

// let writer = fs.createWriteStream(path.join(__dirname, 'tmp.js'));


// let objs = [
//     { name: '张三', age: 10 },
//     { name: '张三', age: 11 },
//     { name: '张三', age: 12 },
//     { name: '张三', age: 13 }
// ]


// for (var key in objs) {
//     if (objs.hasOwnProperty(key)) {
//         var obj = objs[key];
//         let json = JSON.stringify(obj);
//         let buf = new Buffer(json);
//         let bufLen = new Buffer(4);
//         bufLen.writeInt32LE(buf.length);
//         writer.write(bufLen);
//         writer.write(buf);
//     }
// }