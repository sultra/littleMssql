# Little MS-Sql

## 说明
对操作mssql小小的封装

## 使用

配置
``` yaml
mssql:
  user: abc
  password: "1234"
  server: host
  database: tale
  port: 1433
  pool: 
    min: 0
    max: 5
    idleTimeoutMillis: 3000
  showSql: true
```

获取连接

``` sql
const mssqlDb = require('littleMSSql');
const mssqlConn = mssqlDb(mssqlConfig);
mssqlConn.querySql('select * from table where id=@id',{id:123},(err, res)=>{
    ...
});
```

insert 和 update 方法

``` sql
 /**
     * insert 方法
     * @param {obj} addObj 新增数据对象，对象名为字段名
     * @param {string} tableName 表名
     * @param {function} callBack 回调方法
     */
mssqlConn.add({name:'foo'},'tableName',(err, res)=>{
    ...
})

/**
     * 更新数据方法
     * @param {obj} updateObj 要修改数据的对象，对象名为字段名
     * @param {obj} condition 条件对象，用于where 后面的刷选，全部为‘and’关系
     * @param {string} tableName 表名
     * @param {function} callBack 回调方法
     */
mssqlConn.update({name:'boo'},{id:123}, 'tableName', (err, res)=>{
    ...
})
```

