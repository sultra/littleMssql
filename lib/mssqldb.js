const mssql=require('mssql');

class MssqlHandle{
    constructor(config){
        this.dbconfig=config;
    }

    getConnection(callback){
        if (!callback) {
            callback=function(){};
        }
        const connection = new mssql.ConnectionPool(this.dbconfig ,function(err) {
            if (err) {
                throw err;
            }
            callback(connection);
        });
    }

    querySql(sql,params,callback){
        this.getConnection(function (connection){
            const ps=new mssql.PreparedStatement(connection);
            if (params!='') {
                for (const index in params) {
                    if (typeof params[index]== 'number') {
                        ps.input(index,mssql.Int);
                    }else if (typeof params[index]=='string') {
                        ps.input(index, mssql.VarChar);
                    }
                }
            }
            ps.prepare(sql,function(err){
                if (err) {
                    console.log(err);
                }
                ps.execute(params,function(err,recordset){
                    callback(err,recordset);
                    ps.unprepare(function(err){
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            });
        }); 
    }
}
function init(mssqlConfig) {
    return new MssqlHandle(mssqlConfig);
}
module.exports = init;
