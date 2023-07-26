const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const ejs = require('ejs') ;
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

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
    
    const sdate = req.body.sdate ;
    const edate = req.body.edate ;
   
    
    let stime =parseInt(req.body.stime.substring(0,2));
    let etime = parseInt(req.body.etime.substring(0,2)) ;
    console.log(`${stime} ${etime}`);
    console.log(typeof(stime)) ;


    const query = {
        name: "fetch-database",
        text: `SELECT payment_id, amount, 
            TO_CHAR(payment_date,'DD-MM-YYYY') AS DATE, 
            TO_CHAR(payment_date, 'HH12:MI:SS') AS TIME
            FROM payment 
            WHERE DATE(payment_date) BETWEEN $1 AND $2
            AND EXTRACT(HOUR FROM payment_date) BETWEEN $3 AND $4
            ORDER BY payment_date`,
        values: [sdate,edate, stime, etime]
        
    }

    const result = await pool.query(query);
    console.log(result.rows[0]);
    res.render("sql",{
        entries: result.rows,
        sdate: sdate,
        edate: edate
    });
    
});
 
app.post('/download-pdf', async(req, res) => {
   
try {
       
  
 } catch (error) {
 
 } 
        

});
 
    
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});