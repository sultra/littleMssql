# Little MS-Sql

## 说明
对操作mssql小心的封装

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
```

获取连接

``` sql
const mssqlDb = require('littlemssql');
const mssqlConn = mssqlDb(mssqlConfig);
mssqlConn.querySql('select * from table where id=@id',{id:123},(err, res)=>{
    ...
});
```


