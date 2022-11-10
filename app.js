const { read } = require('fs');
const http = require('http'),
path=require('path'),
express =require('express'),
bodyParser=require('body-parser');
const sqlite3 =require('sqlite3').verbose();
const app = express();

app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())




const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
 db.run("INSERT INTO user VALUES ('Dallas', '123', 'Administrator')");
});


app.get('/', (req,res)=>{
    res.sendFile("index.html")
})

app.post('/login',(req,res)=>{
try{
    const userName = req.body.username
    const passWord = req.body.password
    const query = `SELECT title FROM user where username = "${userName}" AND password = "${passWord}" `;

    
    
	console.log("username: " + userName);
	console.log("password: " + passWord);
	console.log('query: ' + query);

        db.get(query, function (err, row) {
	if (err) {
		console.log('ERROR', err);
		res.redirect("/index.html#error");
	} else if (!row) {
		res.redirect("/index.html#unauthorized");
	} else {
		res.send('Hello<b>' + row.title + '!</b><br/> This file containes all your secret data: <br/>SECRETS<br/>MORE SECRETS <br/> <a href ="/index.html">Go back to login</a>');
	}
});

}catch(err){
    console.log(err)
}
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})