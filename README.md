# tmpdb

A simple database with file system.


#### Install
``` bash
    npm install tmpdb
```

#### use
```javascript
const DB = require('tmpdb');
let db = new DB({
    root:'/root/db' 
});

//add data
db.set('user',{
    userName :'admin',
    password:'123456'
});

//edit data
db.set('user',{
    __id : '123',
    userName :'admin',
    password :'1234567'
});
//delete data
db.set('user',{
    __id :'123',
    __deleted:true
});



/**
 * @param filter {Function} the filter Function
    -@param item {Model} the data item
    -@return {Boolean} the data item is matched
 */
db.get('user',filter);

```