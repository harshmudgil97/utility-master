//jshint eversion:6

const express = require("express");
const bodyParser = require("body-parser");
const dateModule = require(__dirname + "/dateModule.js");
const weatherModule = require(__dirname + "/weatherApiModule.js");
const mailModule = require(__dirname + "/mailApiModule.js");
const routeLogic = require(__dirname + "/routeLogic.js");
const localHandle = require('countrycitystatejson');
const api = require(__dirname + "/config.js");
const app = express();
const mongoose = require("mongoose");
const DataModel = require(__dirname+"/dataSchema.js");
mongoose.connect(api.uriMongo,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

let listName = [];
let idRoute = "";
let newCityName = "Delhi";
let newUnit = "";
let countryShortName = "";
let labelCountry = "Choose Country";
let labelState = "Choose State";
let labelCity = "Choose City";
let preDefItemObj = {};

const setDate = dateModule.getDate();
let delhiWeather = weatherModule.getWeather(newCityName, newUnit);
let weather = delhiWeather;

const countryArray = [];
let stateArray = [];
let cityArray = [];


localHandle.getCountries().forEach((item) => {

  countryArray.push(item);

});

function resetValue() {
  labelCountry = "Choose Country";
  labelState = "Choose State";
  labelCity = "Choose City";

  while (stateArray.length != 0) {
    stateArray.pop();
  }

  while (cityArray.length != 0) {
    cityArray.pop();
  }
  countryShortName = "";
}

async function getListName(){

  let quad = []

  return await new Promise((resolve,reject)=>{
    DataModel.find({},function(err,result){

      if(!err){
          result.forEach(function(item){
            quad.push(item.title);
          });

          resolve(quad);
      } else {
        reject(err);
      }

    });
  });



    listName = [...new Set(listName)];
}

async function findData(){

  return await new Promise(function(resolve, reject) {
    DataModel.findOne({
      title: idRoute
    }, function(err, result) {
      if (!err) {
        if(result!= null){
          resolve(result.content);
        }

      } else {
        reject(err);
      }
    });

  });
}

app.get("/", function(req, res) {

  resetValue();
  while(listName.length!=0){
    listName.pop();
  }
  getListName().then((freshList)=>{
  freshList.forEach((item)=>{
    listName.push(item);
  });

  listName = [...new Set(listName)];

  setTimeout(function() {
    if (weather.err == "404") {
      res.render("page404", {
        mainHead: "Error 404, City Not Found",
        setWeather: delhiWeather
      });
      weather = delhiWeather;
    } else if (Object.keys(weather).length === 0) {
      weather = delhiWeather;
      res.render("index", {
        listItem: listName,
        date: setDate,
        setWeather: weather,
        cityName: newCityName,
        buttonType: "buttonListAdder",
        findRoute: "/"
      });
    } else {
      res.render("index", {
        listItem: listName,
        date: setDate,
        setWeather: weather,
        cityName: newCityName,
        buttonType: "buttonListAdder",
        findRoute: "/"
      });
    }

  }, 1000);

}).catch((err)=>{
    console.log(err);
  });



});

app.post("/", function(req, res) {

  if(req.body.newListItem==""){
    res.redirect("/");
  } else {
    let  = routeLogic.postSelect(req.body.buttonListAdder, req.body.newListItem, listName).then((postSelectObj)=>{
      listName = postSelectObj.list;
      idRoute = postSelectObj.selectList;
      listName = [...new Set(listName)];
      newTitle = postSelectObj.newList;

      newTitle.save((err)=>{
        if(!err){
          res.redirect("/" + idRoute);
        }
      });
    }).catch((postSelectObj)=>{
      listName = postSelectObj.list;
      idRoute = postSelectObj.selectList;
      listName = [...new Set(listName)];
      newTitle = postSelectObj.newList;

      res.redirect("/" + idRoute);
    });

  }

});

app.get("/setting",function(req,res){
  res.render("setting", {
    listItem: listName,
    setWeather: weather,
    buttonType: "settingsBtn",
    findRoute: "/setting",
    allCountryData: countryArray,
    allStateData: stateArray,
    allCityData: cityArray,
    labelCountry: labelCountry,
    labelState: labelState,
    labelCity: labelCity
  });
});

app.get("/:id", function(req, res) {
  let idGetFactObj = routeLogic.idGetFact(req.params.id, listName, preDefItemObj, idRoute);
  let getFileName = idGetFactObj.fName;
  getVarName = idGetFactObj.fType;

    findData().then(function(resolvedList){
      res.render(getFileName, {
        listItem: getVarName,
        listDef: resolvedList,
        setWeather: weather,
        buttonType: "settingsBtn",
        findRoute: "/setting",
        allCountryData: countryArray,
        allStateData: stateArray,
        allCityData: cityArray,
        labelCountry: labelCountry,
        labelState: labelState,
        labelCity: labelCity
      });
    }).catch(function(error){
      console.log(error);
    });



});

app.post("/:id", function(req, res) {

  if (req.params.id == "setting") {

    if (req.body.country != null && req.body.country.length > 0) {
      countryShortName = req.body.country;
      labelCountry = localHandle.getCountryByShort(countryShortName)["name"];


      while (cityArray.length != 0) {
        cityArray.pop();
      }

      while (stateArray.length != 0) {
        stateArray.pop();
      }

      labelCity = "Choose City";
      labelState = "choose state";

      stateArray = localHandle.getStatesByShort(countryShortName);

    }

    if (req.body.state != null && req.body.state.length > 0) {
      labelState = req.body.state;

      while (cityArray.length != 0) {
        cityArray.pop();
      }

      labelCity = "Choose City";
      cityArray = localHandle.getCities(countryShortName, labelState);
    }


    if (req.body.settingsBtn == "weatherSaver") {
      newCityName = req.body.newCity;
      labelCity = req.body.newCity;
      weather = weatherModule.getWeather(req.body.newCity, req.body.unit);
      res.redirect("/");
    } else if (req.body.settingsBtn == "subscribed") {
      mailModule.subs(req.body.fName, req.body.lName, req.body.eMail);
      res.render("page404", {
        mainHead: "Subscribed Successfully! Congratulations For Choosing The Best",
        setWeather: weather
      });
    } else {
      let settingRoute = routeLogic.settingRoute(req.body.settingsBtn, listName, preDefItemObj);
      route = settingRoute.route;
      listName = settingRoute.list;
      preDefItemObj = settingRoute.obj;


      res.redirect(route);
    }

  } else {

    if (req.body.multiPurpBtn == idRoute) {
      preDefItemObj = routeLogic.elseRout(req.body.preDefListItem, idRoute, preDefItemObj);
      DataModel.findOne({title:idRoute},function(err,result){
        if(!err){
          result.content.push(req.body.preDefListItem);
          result.save(function(err){
            if(!err){
              res.redirect("/" + idRoute);
            } else {
              console.log(err);
            }
          });
        }
      });



    } else if (req.body.multiPurpBtn == "prefback") {
      res.redirect("/");
    } else if (req.body.multiPurpBtn == "go-back") {
      res.redirect("/setting");
    }
  }

});

app.post("/mod/delete",function(req,res){
    DataModel.findOneAndUpdate({title:req.body.checkList},{$pull:{content:req.body.checker}}, function(err,result){
      if(!err){
        res.redirect("/"+req.body.checkList);
      }
    });
  });



app.listen(process.env.PORT || 3000, function() {
  console.log("server running");
});
