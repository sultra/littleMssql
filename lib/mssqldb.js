const mssql=require('mssql');

class MssqlHandle{
    constructor(config){
        this.dbconfig=config;
        this.showSql=config.showSql || false;
    }

    getConnection(callback){
        const connections = new mssql.ConnectionPool(this.dbconfig ,function(err) {
            if (err) {
                throw err;
            }
            callback(connections);
        });
    }

    async queryData(sql){
        if (this.showSql===true) {
            console.log('show sql: ', sql);
        }
        if (!this.pool) {
            this.pool = await mssql.connect(this.dbconfig);
        }
        let result =await this.pool.request().query(sql);
        return result;
    }

    /**
     * 默认处理返回的数据
     * @param {*} rej 
     * @param {*} reso 
     * @param {*} funcReso 
     */
    defaultHandleResult(rej, reso, funcReso) {
        return function (err, res) {
            if (err) {
                rej(err);
            } else {
                if (funcReso != undefined && typeof funcReso === 'function') {
                    reso(funcReso(res))
                } else {
                    reso(res);
                }
            }
        }
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
            handlePs(ps, sql, params, callback, this.showSql);
        }); 
    }

    //添加数据
    /**
     * insert 方法
     * @param {obj} addObj 新增数据对象，对象名为字段名
     * @param {string} tableName 表名
     * @param {function} callBack 回调方法
     */
    add(addObj, tableName, callBack) {
        this.getConnection(function (connection, showSql) {
            const ps = new mssql.PreparedStatement(connection);
            let sql = `insert into ${tableName} (`;
            let values='(';
            if (addObj != undefined) {
                for (var index in addObj) {
                    if (typeof addObj[index] == 'number') {
                        ps.input(index, mssql.Int);
                    } else if (typeof addObj[index] == 'string') {
                        ps.input(index, mssql.VarChar);
                    }
                    sql += index + ",";
                    values += `@${index},`;
                }
                sql = sql.substring(0, sql.length - 1) + ') values ';
                values = values.substring(0,values.length-1)+')';
                sql+=values;
            }
            handlePs(ps, sql, addObj, callBack, this.showSql);
        });
    }
    
    /**
     * 更新数据方法
     * @param {obj} updateObj 要修改数据的对象，对象名为字段名
     * @param {obj} condition 条件对象，用于where 后面的刷选，全部为‘and’关系
     * @param {string} tableName 表名
     * @param {function} callBack 回调方法
     */
    update(updateObj,condition, tableName, callBack){
        this.getConnection(function (connection, showSql) {
            const ps = new mssql.PreparedStatement(connection);
            let sql = `update ${tableName} set `;
            if (updateObj != undefined) {
                for (var index in updateObj) {
                    if (typeof updateObj[index] == 'number') {
                        ps.input(index, mssql.Int);
                    } else if (typeof updateObj[index] == 'string') {
                        ps.input(index, mssql.VarChar);
                    }
                    sql += `${index}=@${index},`;
                }
                sql = sql.substring(0, sql.length - 1);
                if (condition!=undefined) {
                    sql+=' where ';
                    for (var index in condition) {
                        if (typeof condition[index] == 'number') {
                            ps.input(index, mssql.Int);
                        } else if (typeof condition[index] == 'string') {
                            ps.input(index, mssql.VarChar);
                        }
                        sql += `${index}=@${index} and `;
                    }
                    //移除最后到‘and’ 长度为5是因为包含前后两个空格
                    sql = sql.substring(0, sql.length - 5);
                    //合并condition对象到updateObj，用于被执行时使用
                    Object.assign(updateObj,condition);
                }
            }
            handlePs(ps, sql, updateObj, callBack, this.showSql);
        });
    }
}

/**
 * 执行最后提交到数据库执行方法
 * @param {obj} ps prepareStatment
 * @param {string} sql sql语句
 * @param {obj} paramsObj 查询参数
 * @param {function} callBack 回调函数
 */
function handlePs(ps, sql, paramsObj, callBack, showSql) {
    if (showSql===true) {
        console.log('show sql: ',sql);
    }
    ps.prepare(sql, function (err) {
        if (err)
            console.log(err);
        ps.execute(paramsObj, function (err, recordset) {
            callBack(err, recordset);
            ps.unprepare(function (err) {
                if (err)
                    console.log(err);
            });
        });
    });
}

function init(mssqlConfig) {
    return new MssqlHandle(mssqlConfig);
}
module.exports = init;


