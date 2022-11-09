const bodyParser = require('body-parser')
const http = require('http')
const path = require('path')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const app = express()
app.use(express.static('.'))
app.use(bodyParser.urlencoded({extend:true}))
app.use(bodyParser.json())


const db = new sqlite3.Database(":memory");
db.serialize(function (){
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', (req,res)=>{
    res.sendFile("index.html")
})

app.post('/login', async (req,res)=>{
try{
    const userName = await req.body.username
    const passWord = await req.body.password
    const query = ` SELECT title FROM user WHERE username = ${userName} AND password = ${passWord}`
    console.log(userName, passWord , query)

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