const mongoose = require("mongoose");
const DataModel = require(__dirname + "/dataSchema.js");
mongoose.connect("mongodb://localhost:27017/utilityDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


function del(toRemove, list, obj) {

  DataModel.deleteOne({
    title: toRemove
  }, (err) => {

    if (!err) {
      console.log("ok");
    }

  });
  for (var i = 0; i <= list.length; i++) {
    if (list[i] == toRemove) {
      list.splice(i, 1);
    }
  }
  for (var key in obj) {
    if (key == toRemove) {
      delete obj[key];
    }
  }
  return {
    list: list,
    obj: obj
  };
}

exports.postSelect = async function(btnName, newItem, list) {


    return await new Promise((resolve,reject)=>{
      if (btnName == "trustedFlag") {
      DataModel.findOne({
        title: newItem
      }, function(err, result) {
        if (!err) {
          if (!result) {
            if (newItem != "") {
              list.push(newItem);
              const item = new DataModel({
                title:newItem,
                content: []
              });

              resolve({
                list: list,
                selectList: "",
                newList: item
              });

            }
          }
        }
      });
    }  else {

        reject( {
          list: list,
          selectList: btnName,
          newList: ""
        });
      }

    });


}


exports.idGetFact = function(fileName, list, obj, fileType) {
  let fName = "",
    fType = "",
    objList = "";

    if (fileType == "") {
      fName = "preDefList";
      fType = fileType;
    } else {
      fName = "preDefList";
      fType = fileType;

      if (!(fileType in obj)) {
        objList = "";
      } else {
        objList = obj[fileType];
      }
    }
  

  return {
    fName: fName,
    fType: fType,
    objList: objList
  };
}

exports.settingRoute = function(btn, list, obj) {

  if (btn == "back") {


    return {
      route: "/",
      list: list,
      obj: obj
    };
  } else {

    let newDel = del(btn, list, obj);

    return {
      route: "/setting",
      list: newDel.list,
      obj: newDel.obj
    };
  }
}

exports.elseRout = function(newItem, route, obj) {

  let objList = [];

  if (!(route in obj)) {
    objList.push(newItem);
  } else {
    objList = obj[route];
    objList.push(newItem);
  }

  obj[route] = objList;
  return obj;
}
