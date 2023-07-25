const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const ejs = require('ejs') ;

const app = express();
const port = 3000;
dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.set('view engine', 'ejs') ;
app.use(express.static(__dirname + '/public'));

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", async(req, res) => {
    
    const {sdate, edate} = req.body ;
    console.log(`${sdate} ${edate}`);
    console.log(typeof(sdate));
    
    const query = {
        name: "fetch-database",
        text: `SELECT payment_id, amount, TO_CHAR(payment_date,'DD-MM-YYYY')
            FROM payment WHERE DATE(payment_date)
            BETWEEN $1 AND $2
            ORDER BY DATE(payment_date)`,
        values: [sdate,edate]
        
    }

    const result = await pool.query(query);
    console.log(result.rows);
    res.render("sql",{
        entries: result.rows
    });
    
});
 
 
    
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });