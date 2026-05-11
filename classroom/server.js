const express=require("express");
const app=express();
const session=require("express-session");
const port=8080;
const path = require("path");

const flash=require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOption));
app.use(flash());

app.get("/register",(req,res)=>{
    let{name}=req.query;
    req.session.name=name;
    req.flash("success","user registerd successfully")
    res.redirect("/hello");

});

 app.get("/hello",(req,res)=>{
    res.locals.messages=req.flash("success");
    res.render("page.ejs",{name:req.session.name});
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//      req.session.count=2;
//     }
    
//     res.send(`you send the request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

app.listen(port,()=>{
console.log("app is listing");
});




