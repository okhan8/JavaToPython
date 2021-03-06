import store from "../ninia/src/store.js";

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.listen(port, (err) => {
	if (err) { console.log(err)};
	console.log(`Listening on port ${port}`);
});

app.get('/express_backend', (req, res) => {
	res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACTs' });
});

var request = require('request');
/*app.get('/api', function(req, res, next) {
    var program = {
    script : `public class HelloWorld{
        public static void main(String[] args){
            System.out.println("Hello World!");
        }
    }`,
    language: "java",
    versionIndex: "0",
    clientId: "209cef41ccb90e7de7d6443bb8f5a5c",
    clientSecret:"83ed2418d762cf0642bd0be03b485299559aa4383084f952dbb8ee02ac16c7b9"
    }
}); */


/* request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}); */

/*request("https://api.jdoodle.com/v1/execute", function(error, response, body) {
    if (error) {
        console.log("There was an error");
    }
    else {
        console.log(body);
        console.log(response && response.statusCode);
    }
})*/