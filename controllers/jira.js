"use strict";
const facebookGraphService = require("../services/facebook_graph");

const router = require("express").Router();

module.exports = router

router.post("/", function(req, res) {
  console.log("JIRA WEBHOOK")
  let data  = req.body;
  let issue = data.issue;
    
  let CHAT_MESSAGE = issue.key +
    "\n\n" +
    issue.fields.description +
    "\n\n" +
    issue.self +
    "\n\nAprueba el pedido?";
  
  console.log(data);
  //facebookGraphService.sendTextMessage(CHAT_ID_USER, CHAT_MESSAGE);
});

router.get("/",function(req,res){
  return res.send("wat-jira");
})



