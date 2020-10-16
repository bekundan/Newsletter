var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var https = require("https");

var app = express();
//we have put all the files in a static folder files like stylesheet,images,etc.
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

//now routing
app.get("/",function(req,res){
    res.sendFile(__dirname +"/signup.html");
});
//get the form data
app.post("/", function(req,res){
    var fname = req.body.firstname;
    var lname =req.body.lastname;
    var email =req.body.email;
//now we need apikey and the list id for send data to mailchimp
//api key = 51a9a1bfcd389239bd45dc8d6ba917dc-us2
//list id = 21b9a7b3fb
//now collect all data in one var
var data = {
    members: [
        {
            email_address: email,
            status:"subscribed",
            merge_fields:{
                FNAME: fname,
                LNAME: lname
            }

        }
    ]
}
//get the data in one var
const jsonData = JSON.stringify(data);
//set the url o send data
const url = "https://us2.api.mailchimp.com/3.0/lists/21b9a7b3fb";
//check the method and the auth
const option = {
    method:"POST",
    auth :"kunboi:51a9a1bfcd389239bd45dc8d6ba917dc-us2"
}
//now use the request method 
const request = https.request(url,option, function(response){
    if(response.statusCode ===  200){
        res.sendFile(__dirname + "/success.html");
    }else{
        res.sendFile(__dirname + "/fail.html");
    }
    response.on("data", function(data){
        console.log(JSON.parse(data));
    })
   
})
request.write(jsonData);
request.end();
// request.write(jsonData);
// request.end();


    console.log("data submitted");    
    console.log(jsonData);
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on the port "+ 3000);
});
