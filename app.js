const express=require("express");
const path=require("path");
const expressLayouts=require("express-ejs-layouts");
const bodyParser=require("body-parser");


//app init
const app=express();

// process.env.PORT, incase i host this website
const PORT=process.env.PORT||3000;

//template engine (ejs)
app.use(expressLayouts);
app.set('view engine','ejs');


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// set public folder
app.use(express.static(path.join(__dirname,"public")));


//temporary routes for frontend development
app.get('/',(req,res)=>{
    res.render('registerDev');
});




//listening to port
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
});