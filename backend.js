var express = require("express");        //https://www.npmjs.com/package/express
var bodyParser = require("body-parser"); //https://www.npmjs.com/package/body-parser
var Airtable = require("airtable");     //https://airtable.com/mybase/api/docs#javascript/table:astronauts:create
var path = require("path");              //https://www.npmjs.com/package/npm-path
var nodemailer = require("nodemailer"); //https://www.w3schools.com/nodejs/nodejs_email.asp
var http = require("https");

var app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

Airtable.configure({       
  endpointUrl: "https://api.airtable.com",
  apiKey: "myapikey"
});

var base = Airtable.base("mybase");


app.use(express.static("www"));


app.post("/join-us", urlencodedParser, function (req, res) { 

  var body = req.body;

  base("Astronauts").create([     
    {
      "fields": {
        "Name": body.firstName,          
        "Middle Name": body.middleName,
        "Last Name": body.lastName,
        "Gender": body.gender,         
        "Eyes": body.eyes,
        "hair": body.hair,
        "Eyes": body.eyes,
        "age": body.age,
        "weight": body.weight,
        "email": body.email,
        "phone": body.phone,
        "Address": body.address,
        "phone": body.phone,
        "mission": body.mission,
        "Bio": body.bio,
      }
    },
  ], function (err, records) {     
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

  /*-------------------------------MAIL------------------------------*/

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "myemail",
      pass: "mypass"
    }
  });

  var mailOptions = {
    from: "myemail",
    to: body.email,                                   
    subject: "Sending Email using Node.js",
    text: "Your apply has been received"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.sendFile("www/apply.html", {
    root: path.join(__dirname, "./")
  })
});

/*---------------------------------------NEWS-LETTER------------------------------------*/

app.post("/about-us", urlencodedParser, function (req, res) {

  var body = req.body;

  base("news-letter").create([
    {
      "fields": {
        "full-name": body.FirstLastName,
        "email": body.email,
      }
    },
  ], function (err, records) {      
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

  /*----------------------------INVIO MAIL--------------------------*/

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "myemail",
      pass: "mypass"
    }
  });

  var mailOptions = {
    from: "myemail",
    to: body.email,                                   
    subject: "Sending Email using Node.js",
    text: "Thank you for your subscription"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.sendFile("www/news-letter.html", { 
    root: path.join(__dirname, "./")
  })
})



app.use((err, req, res, next) => {
  console.error("ERROR", err.stack);
  switch (true) {
    case typeof err === "string":
      // custom application error
      var is404 = err.toLowerCase().endsWith("not found");
      var statusCode = is404 ? 404 : 400;
      return res.status(statusCode).json({ message: err });
    default:
      return res.status(500).json({ message: err });
  }
});

var port = 8080;
app.listen(port, () => console.log("Server listening on port " + port));
