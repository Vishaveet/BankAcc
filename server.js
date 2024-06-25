const express = require("express");
const app = express();
const port = 8000;
const mysql = require("mysql");
const ejs = require("ejs");
const fs = require("fs");
const { error } = require("console");

app.use(express.urlencoded({ extended: true }));

// Middleware to handle JSON responses
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Create a MySQL connection
const connection =mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "nodedb",
});
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to the MySQL server
connection.connect((error) => {
  if (error) throw error;
  console.log("Connected to MySQL server");
});

// Define a route to render the data from MySQL
app.get("/", (req, res) => {
  connection.query("SELECT * FROM Bank", (error, data) => {
    if (error) throw error;

    // Render the EJS template with data from the MySQL table
    
    // res.render("template", { data: results });  
      //  res.send({'data':`${data}`});
      res.json({ data: data });
  });
});
app.post("/create", (req, res) => {
  const { Cus_name, balance } = req.body; // Assuming you send Cus_name and balance in the request body
  
  connection.query(
    `INSERT INTO Bank (cus_name, balance) values ('${Cus_name}', '${balance}')`,
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: 'Failed to create account' });
      } else {
        const insertedId = results.insertId;
        console.log("Inserted data successfully with ID:", insertedId);
        res.json({ ID: insertedId });
      }
    }
  );
});

app.get("/deposit", (req, res) => {
    let balance=req.query.balance;
    console.log(balance);
    let id=req.query.id;
    connection.query(
      `UPDATE Bank SET Balance =balance +'${balance}' WHERE ID ='${id}'`,
      (error) => {
        if (error) throw error;
        console.log("Updated data successfully");
        // res.send("Update Acc Successfully Acc_no=1");
      }
    );
    connection.query(
      `SELECT * FROM Bank where ID='${id}'`,(error,data)=>{
        if(error) throw error;
        
        res.json({data});
      }
    )
});

app.get("/withdraw", (req, res) => {
  let balance=req.query.balance;
  console.log(balance);
  let id=req.query.id;
  connection.query(
    `UPDATE Bank SET Balance =balance -'${balance}' WHERE ID ='${id}'`,
    (error) => {
      if (error) throw error;
      console.log("Updated data successfully");
      // res.send("Update Acc Successfully Acc_no=1");
    }
  );
  connection.query(
    `SELECT * FROM Bank where ID='${id}'`,(error,data)=>{
      if(error) throw error;
      
      res.json({data});
    }
  )
});

app.get("/search", (req, res) => {
    
  let id=req.query.id;
    connection.query(`SELECT * FROM Bank WHERE ID='${id}'`, (error, results) => {
      if (error) throw error;
  
      // Render the EJS template with data from the MySQL table
      console.log("Searched data successfully");
      res.json({ data: results });
    });
});

app.get("/close", (req, res) => {
    
  let id=req.query.id;
    connection.query(`Delete FROM bank WHERE ID='${id}'`, (error, results) => {
      if (error) throw error;
  
      // Render the EJS template with data from the MySQL table
      console.log("delete data successfully");
      res.json({ data: results });
    });
});


app.get('/max',(req,res)=>{
  connection.query("SELECT max(Balance) as balance FROM bank",(error,data)=>{
    if(error) throw error;

    console.log("maximum Balance");
    res.json({data:data})
  })
})

app.get('/min',(req,res)=>{
  connection.query("SELECT min(Balance) as balance FROM bank",(error,data)=>{
    if(error) throw error;

    console.log("minimum Balance");
    res.json({data:data})
  })
})

app.get('/avg',(req,res)=>{
  connection.query("SELECT avg(Balance) as avg FROM bank",(error,data)=>{
    if(error) throw error;

    console.log("Average Balance");
    res.json({data:data})
  })
})

app.get('/count',(req,res)=>{
  connection.query("SELECT count(Balance) as Accs FROM bank",(error,data)=>{
    if(error) throw error;

    console.log("Count No of Acc");
    res.json({data:data})
  })
})

app.get('/sum',(req,res)=>{
  connection.query("SELECT sum(Balance) as sum FROM bank",(error,data)=>{
    if(error) throw error;

    console.log("Sum of Balance");
    res.json({data:data})
  })
})

app.get('/all',(req,res)=>{
  connection.query("SELECT sum(Balance) as total,avg(Balance),count(Balance),max(Balance),min(Balance) FROM `bank`",(error,data)=>{
    if(error) throw error;

    console.log("Sum of Balance");
    res.json({data:data})
  })
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
