var express = require('express');


var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var path = require('path');
var mysql = require('mysql');
var session = require('express-session');

const bcrypt = require('bcrypt');


var con = mysql.createConnection({
    host: "n2o93bb1bwmn0zle.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "uvrz3xh8nxqf3dgg",
    password: "vmj6qnbfh0f07d2p",
    database: "xs80pat7dq8s0wj1"
});




var passport = require('passport') , LocalStrategy = require('passport-local').Strategy;

app.use(express.static("public"));
app.use(session({
    secret: "cats",
    resave: true,
    saveUninitialized: false}
    ));

app.use(passport.initialize());
app.use(passport.session());



// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user.user_id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    con.query("select * from online_banking where user_id = "+id,function(err,rows){
        done(err, rows[0]);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username, password)
        con.query("SELECT * FROM online_banking WHERE login = ?", username, (err, results, fields) =>{
            if (err) { return done(err); }
            if (!results[0]) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, results[0].password, function(err, result) {
                if (result == false)  {
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    return done(null, results[0])
                }
            });

        })
    }
));

function adminLoggedIn(req, res, next) {
    if (req.user){
        if (req.user.role == "admin") {
        next();
        } else {
            res.send('you have to be an admin to access this page !');
        }
    }
    else {
        res.send('you have to be logged in as admin to access this page !');
    }
}


//used to log in by posting query parameters username and password
app.post('/login',passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.send('You are logged in');
        console.log(req.user.login)
    });



// response is only sent to admins that are logged in
app.get('/', adminLoggedIn, function (req, res) {

    res.send("you are logged in");
 
});

//Mysql
app.get('/users', adminLoggedIn, async (req, res )=>{
    let sql = "select * from users_v_account_cards;";
      
con.query(sql, true, (error, results, fields) => {
    if (error) {
         console.error(error.message, fields);
         return res.status(301).send(error.message);
    }
    console.log(results[0]);
    res.status(200).send(results);
});

})
app.post('/createuser', adminLoggedIn, async (req, res )=>{
    const parameters =  req.body;
          let sql = `CALL CreatetUserAndAccount(
            "${parameters.firstName}", 
            "${parameters.lastName}", 
            "${parameters.userEmail}", 
            "${parameters.userGender}", 
            "${parameters.userPhone}", 
            "${parameters.bankAddress}", 
            "${parameters.userCurrency}",
            ${parameters.userAmount}, 
            ${parameters.pinCode},
            ${parameters.expDate}
            )`;
            
    con.query(sql, true, (error, results, fields) => {
        if (error) {
             console.error(error.message);
             return res.status(301).send(error.message);
        }
        // console.log(results[0]);
        res.status(200).send("User created succesfully");
    });
})

app.put('/updateuser', adminLoggedIn, (req, res)=> {
    const parameters =  req.body;

    let sql = `CALL UpdateUser(
        ${parameters.userId},
        "${parameters.firstName}", 
        "${parameters.lastName}", 
        "${parameters.userEmail}", 
        "${parameters.userGender}", 
        "${parameters.userPhone}"
        )`;

con.query(sql, true, (error, results, fields) => {
    if (error) {
         console.error(error.message, fields);
         return res.status(301).send(error.message);
    }
    console.log(results[0], fields);
    res.status(200).send("User was updated");
});
})

app.delete('/deleteuser', adminLoggedIn, async (req, res )=>{
    const userId =  req.body.userId;
        let sql = `CALL DeleteUserAndAccount(
            ${userId} 
            )`;
    con.query(sql, true, (error, results, fields) => {
        if (error) {
             console.error(error.message, fields);
             return res.status(301).send(error.message);
        }
        console.log(results[0], fields);
        res.status(200).send("User was deleted");
    });
});


app.get('/bankemployees', adminLoggedIn, async (req, res )=>{
    let sql = "select * from bank_v_employee;";
      
con.query(sql, true, (error, results, fields) => {
    if (error) {
         console.error(error.message, fields);
         return res.status(301).send(error.message);
    }
    console.log(results[0]);
    res.status(200).send(results);
});

})


//Neo4j
const {getUsers, getOneUser, updateUser, createUser, deleteUser} = require('./controllers/userController');
const User = require('./models/User');

app.get("/neousers", async (req, res) => {
try {
    getUsers().then((users) => {
        return res.json(users).end();
    });
} catch (error) {
    console.log(error)
}
});

app.put('/neoupdateuser', adminLoggedIn, (req, res)=> {
    const parameters =  req.body;
    try {
        updateUser(parameters).then((result) =>{
            return res.json(result).end();
        });    
    } catch (error) {
        console.log(error)
    }
});
app.post("/createneouser", async (req, res)=>{
    const parameters = req.body;
    try {
        const newUser = await createUser(parameters);
        res.send("New user created: " + JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
})

app.get("/deleteneouser", async (req, res) => {
    const id = req.body.id
    console.log(id)
    try {
        await deleteUser(id);
        res.send("User deleted")
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT || 4000, function () {
    console.log('Node app is working!');
});