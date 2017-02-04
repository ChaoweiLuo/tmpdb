const crypto = require('crypto');


const generate = function() {
    let time = new Date;
    let str = time.getTime().toString(32);
    let en = crypto.createHmac('sha1', crypto.randomBytes(256));
    return en.update(str).digest().toString("hex")
}
module.exports = generate;