var express = require("express");        //https://www.npmjs.com/package/express
var bodyParser = require("body-parser"); //https://www.npmjs.com/package/body-parser
var Airtable = require("airtable");     //https://airtable.com/mybase/api/docs#javascript/table:astronauts:create
var path = require("path");              //https://www.npmjs.com/package/npm-path
var nodemailer = require("nodemailer"); //https://www.w3schools.com/nodejs/nodejs_email.asp
var http = require("https");

var app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

Airtable.configure({      //configuro airtable 
  endpointUrl: "https://api.airtable.com",
  apiKey: "myapikey"
});

var base = Airtable.base("mybase");


app.use(express.static("www"));

// tu fai una richiesta di POST che va a finrie nella request appunto e quindi grazie a body-parser prendi quella request e la fai diventare il body dell"index
app.post("/join-us", urlencodedParser, function (req, res) { //post perchè il post nel form è un method POST

  var body = req.body;

  //airtable.com/tblAVF75CETKifJFh/viwevzf6lc2MSWElf?blocks=hide

  base("Astronauts").create([     //db airtable
    {
      "fields": {
        "Name": body.firstName,           //il "Name" si riferisce al db airtable mentre body.firstName al name dato agli input/select nel join-us
        "Middle Name": body.middleName,
        "Last Name": body.lastName,
        "Gender": body.gender,          //ricorda che è la value dell"index/join-us che determina il valore!!
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
  ], function (err, records) {      // gestisco errori
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

  /*-------------------------------MAIL------------------------------*/

//https://www.w3schools.com/nodejs/nodejs_email.asp

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "myemail",
      pass: "mypass"
    }
  });

  var mailOptions = {
    from: "myemail",
    to: body.email,                                   //la prendo con il body-parser
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
  ], function (err, records) {      // gestisco errori
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });

  /*----------------------------INVIO MAIL--------------------------*/

  //https://www.w3schools.com/nodejs/nodejs_email.asp


  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "myemail",
      pass: "mypass"
    }
  });

  var mailOptions = {
    from: "myemail",
    to: body.email,                                   //la prendo con il body-parser
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

  res.sendFile("www/news-letter.html", {   //perchè sta in www/apply.html
    root: path.join(__dirname, "./")
  })
})


// GESTIONE ERRORE
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