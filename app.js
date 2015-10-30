var express = require('express');
var app = express();
var port = 9050;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/ar.html');
});

app.use(express.static(__dirname));

app.listen(port);
console.log('Server started on port ' + port);
