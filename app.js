//import library
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash')
//import models
const Application = require('./models/application');
// const { application } = require('express');
const Recap = require('./models/recap')
const User = require('./models/users')

//import routes
const userRoute = require('./routes/user')
const applcationRoute = require('./routes/applications')

//define app
const app = express();

//connecting to database
const dbUrl = 'mongodb://localhost:27017/application-tracker'
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.log.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

//set the view for application
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//set up session config
const secret = 'thisisabadsecret'
const sessionConfig = {
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7

    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    console.log(req.user)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    next();
})

//user part
app.use('/',userRoute)
//CRUD
app.use('/applications',applcationRoute)



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log(`Serving on Port 3000`)
})


