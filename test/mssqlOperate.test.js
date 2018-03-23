const config = {
    user: 'shzx',
    password: '1234',
    server: '192.168.123.101',
    database: 'ibms_shzx',
    port: 1433,
    pool: {
        min: 0,
        max: 5,
        idleTimeoutMillis: 1000
    }
};
const assert = require('assert');
const db=require('../lib');
const conn=db(config);

// describe('insert into', () => {
    // it('insert', (done) => {
        // assert.doesNotThrow(() => {
            // conn.querySql('insert into Ts_Permission (matchName,isInclude,role,matchContent) values (@matchName,@isInclude,@role,@matchContent)',
            //     { matchName: 'group', isInclude: 0, role: 'jkr3', matchContent: '123456' },(err,res)=>{
            //        if (err) {
            //            console.log('err',err);
            //        }else{
            //            console.log(res);
            //        }
            //     });

    conn.add({ matchName: 'group/test', isInclude: 1, role: 'jkr3', matchContent: '123456' }, 'Ts_Permission', (err, res) => {
        if (err) {
            console.log('err', err);
        } else {
            console.log(res);
        }
    });
//         }, 'must be connect error');
//     });
// });