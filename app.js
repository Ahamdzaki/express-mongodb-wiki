const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const app = express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));






const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});



const Article = new mongoose.model("Article",articleSchema);



// const ai = new Article({
//     title: "AI",
//     content: "AI is a machine that can search and perfom human action"
// });

// ai.save();

app.route("/articles")
.get(function(req,res){
    Article.find().then(function(foundArticle){
        res.send(foundArticle);
    }).catch(function(err){
        console.log(err);
    });
})

.post(function(req,res){

    const data = new Article({
        title: req.body.title,
        content: req.body.content
    });
    data.save();
  
})


.delete(function(req,res){
    Article.deleteMany().then(function(){
        console.log("data delete successfully");
    }).catch(function(err){
        console.log(err);
    });
});



app.route("/articles/:articleTitle")
.get(function(req,res){
    //localhost3000/articles/aricleTitle
    //locahost300/aricles/ahmad
    const title = req.params.articleTitle;
    

    Article.findOne({title: title }).then(function(foundTitle){
        if (foundTitle){
            res.send(foundTitle);
        }
        else {
        console.log( "not exist exist");
        }
    }).catch(function(err){
        console.log(err);
    });
})
.delete(function(req,res){
    

    Article.deleteMany({title: req.params.articleTitle}).then(function(){
        console.log("deleted successfully");
       
    }).catch(function(err){
        console.log(err);
    });
})
.put(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {new:true}
        ).then(function(){
            console.log("data updated successfully");
        }).catch(function(err){
            console.log(err);
        });
})
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set:req.body}
        ).then(function(){
            console.log("data updated successfully");
        }).catch(function(err){
            console.log(err);
        });
});






app.listen("3000",function(){
    console.log("server on");
});