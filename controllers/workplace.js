"use strict";
const facebookGraphService = require("../services/facebook_graph");
const isJson               = require("../utils/isJson");
const asyncLib             = require("async");
const router               = require("express").Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || null

if(!VERIFY_TOKEN){
  throw new Error("Es necesario la variable de entorno VERIFY_TOKEN")
}

const postBacks = {
  "START_MENU"  : require("../postbacks/startMenu"),
  "CHECK_ISSUES":require("../postbacks/checkIssues"),
  "VIEW_ISSUE"  :require("../postbacks/viewIssue")
}

const quickReplies = {
  "QR_APPROVE_ISSUE": require("../quickreplies/approveIssue.js"),
  "QR_DECLINE_ISSUE": require("../quickreplies/declineIssue.js")
}


module.exports = router

router.get("/",function(req, res) {
  let requestHubMode     = req.query["hub.mode"];
  let requestVerifyToken = req.query["hub.verify_token"]
  
  if (requestHubMode === "subscribe" && requestVerifyToken=== VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

router.post("/", function(req, res) {
    var data = req.body;
    switch (data.object) {
      case "page":
        processPageEvents(data);
        break;
      default:
        console.log("Unhandled Webhook Object", data.object);
    }
    res.sendStatus(200);
});


function processPageEvents(data) {
  data.entry.forEach(function(entry) {
    let page_id = entry.id;
    // Chat messages sent to the page
    if (entry.messaging) {
      entry.messaging.forEach(function(messaging_event) {
        console.log("Page Messaging Event", page_id, messaging_event);
        if (messaging_event.message) {
          receivedMessage(messaging_event);
        }
        
        if(messaging_event.postback){
          receivedPostback(messaging_event);
        }
        
      });
    }
    // Page related changes, or mentions of the page
    if (entry.changes) {
      entry.changes.forEach(function(change) {
        console.log("Page Change", page_id, change);
      });
    }
  });
}

function receivedMessage(event) {
  let senderID      = event.sender.id;
  let recipientID   = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message       = event.message;

  console.log(`Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message`);
  
  let isEcho    = message.is_echo;
  let messageId = message.mid;
  let appId     = message.app_id;
  let metadata  = message.metadata;
  
  let quickReply = message.quick_reply;

  if (isEcho) {
    console.log(`Received echo for message ${messageId} and app ${appId} with metadata ${metadata}`);
    return;
  } 
  
  if (quickReply) {
  
    console.log(`Quick reply for message ${messageId} with payload ${quickReply.payload}`);
    
    if(!isJson(quickReply.payload)){
      console.log("Quick reply payload no es json",quickReply.payload);
      return;
    }
    
    let quickReplyPayloadParsed = JSON.parse(quickReply.payload);
    quickReplies[quickReplyPayloadParsed.event](event)
    return;
  }
}

function receivedPostback(event){
  let payload       = event.postback.payload || {};
  
  if(!payload){
    console.warn("No se encuentra el parametro payload");
    return;
  }
  
  if(!isJson(payload)){
    console.log("PAYLOAD no es JSON",payload);
    return;
  }
  
  let payloadParsed = JSON.parse(payload);
  postBacks[payloadParsed.event](event);
}
