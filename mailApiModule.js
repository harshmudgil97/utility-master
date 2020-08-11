const https = require("https");
const request = require("request");
const api = require(__dirname + "/config.js");

exports.subs = function(fName, lName, eMail) {

  let resCo = "";
  const data = {
    members: [{
      email_address: eMail,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/" + api.mail_list_id;

  const options = {
    method: "POST",
    auth: "harsh:" + api.mailChimpApi
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {

      resCo = response.statusCode;
    });
  });

  request.write(jData);
  request.end();

}
