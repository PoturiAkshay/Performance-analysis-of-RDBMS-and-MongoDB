// Retrieve

var MongoClient = require('mongodb').MongoClient;
var mysql=require('mysql');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var stationids = require('./weatherStation.json') 


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))

var response;
var DB_obj;
var connection;
var station_ids=[];
var records=[];
var DB_selected;
var Station_selected;

MongoClient.connect("mongodb://localhost:27017/super",function(err, db) {	
	DB_obj = db.db("super");
		});


connection = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'akshay@1024',
			database : 'casestudy'
			});	
	connection.connect();


app.listen(3000, 
	function() {
	console.log('listening on 3000')
	})


app.get('/', 
function(req, res) { 
//res.render(__dirname + '/main.ejs', {stations: {},DB:DB_selected,station:Station_selected});
res.render(__dirname + '/main.ejs', {DB: DB_selected,stations:stationids,station:Station_selected});
});


app.post('/',function(req,res)
{
	DB_selected = req.body.Db_selector	
	Station_selected=req.body.Station_selector
	console.log('selected value is', DB_selected+" "+Station_selected);	

// if(Station_selected == undefined)
// {

// 	res.render(__dirname + '/main.ejs', {DB: DB_selected,stations:stationids,station:Station_selected});

// }

// else
// {
	if(DB_selected=="My SQL")
	{

				
		// get a timestamp before running the query
		var before = Date.now();

		connection.query('SELECT * from brazil_weather where wsid='+Station_selected+' limit 10000', function(err, rows, fields) {
	
			// get a timestamp after running the query
			var after = Date.now();
			// calculate the duration in seconds
			var duration = after - before;

			if (!err){
			res.render(__dirname + '/table.ejs', {data: rows,DB: DB_selected,time:duration});

			}
			
			else
			console.log(err);
			
			});
	}

	if(DB_selected=="Mongo DB")
	{

		var query = { "wsid": Number(Station_selected) };

		// get a timestamp before running the query
		var before = Date.now();

		DB_obj.collection("hourlyweathersurface").find(query).limit(10000).toArray (function(err, result)
				{

					// get a timestamp after running the query
					var after = Date.now();
					// calculate the duration in seconds
					var duration = after - before;

					var data=result;
						res.render(__dirname + '/table.ejs', {data: data,DB: DB_selected,time:duration});

				}) ;
	}
//}

});
