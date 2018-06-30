var express         = require("express"),
    mongoose        = require("mongoose"),
    app             = express(),
    bodyparser      = require("body-parser"),
    methodoverride  = require("method-override"),
    expresssanitizer= require("express-sanitizer");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));
mongoose.connect("mongodb://localhost/blog");
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog = mongoose.model("blog",blogSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!!");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       } 
    });
});

app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundblog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundblog});
        }
    });    
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundblog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/"+req.params.id);
      }
   });
});
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   }) 
});

app.listen("3000",function(req,res){
   console.log("Starting Server on port 3000!!"); 
});