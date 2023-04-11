//dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
const { addListener } = require("nodemon");
//connecting with database
var _ = require('lodash');

const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/toDoListDB',{useNewUrlParser:true});
const itemsSchema = new mongoose.Schema({
    name:{
        type: String,
    required: [true,"Please check your data entry no name specified"]
    }
});
const Item = mongoose.model('Item', itemsSchema);  
const Item1=new Item({
    name:"Welcome to your to do list",
     
})
const Item2=new Item({
    name:"Press + to add new task",
     
})
const Item3=new Item({
    name:"check ✅ to delete task",
     
})
const defaultItem=[Item1,Item2,Item3]
const listSchema = {
    name: String,
    items: [itemsSchema]
  };
  
  const List = mongoose.model("List", listSchema);

var app = express();
var date = require(__dirname+'/date.js')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");
var newTask='';

app.post("/", function(req, res) {
    const itemName = req.body.newtask;
    const listName=req.body.list;
    const item=new Item({
        name:itemName
    })

        
    if(listName==="Today"){
        item.save()
         
        res.redirect("/");     
    }
    else{
        List.findOne({name:listName},function(err,foundList){
        foundList.items.push(item)
        foundList.save()
        res.redirect("/"+listName)

        })

    }

});

app.post("/removetask", function(req, res){
   
         let removeItem=req.body.checkbox;
         const listName=req.body.listName;

         if(listName==='Today'){
            Item.deleteOne({_id:removeItem},function(){
                console.log("Item is Deleted")
    
            });
            res.redirect('/')
         }
         else{
            List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: removeItem}}}, function(err, foundList){
                if (!err){
                  res.redirect("/" + listName);
                }
              });
         }
        
       } );


app.get("/", function(req, res) {
    let day=date.getDate();
Item.find({},function(err,foundItem){
    if(foundItem.length===0){

        Item.insertMany(defaultItem,function(err){
            
            if(err){
                console.log(err)
            }
            else{
                console.log("successfully added in DB")
            }
        });
        res.redirect('/')
    }
    
    else{
        res.render("list", { task:foundItem,Date:day,Day:"Today"});

    }
    
});    
});
app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItem
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
          let day=date.getDate();
          res.render("list", {Date:day,Day: foundList.name, task: foundList.items});
        }
      }
    });
  
  
  
  });


//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});

