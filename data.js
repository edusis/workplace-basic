var conn = mysql.createConnection({ 
    host: "dbmysqlbcp.mysql.database.azure.com", 
    user: "edusis@dbmysqlbcp", 
    password: { your_password }, 
    database: { your_database }, 
    port: 3306, 
    ssl: { 
        ca: fs.readFileSync({ "ca-cert filename":1 })
    }
});