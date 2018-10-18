"use strict";
const facebookGraphService = require("../services/facebook_graph");
const isJson               = require("../utils/isJson");
const asyncLib             = require("async");
const router               = require("express").Router();


const VERIFY_TOKEN = process.env.VERIFY_TOKEN || null

if(!VERIFY_TOKEN){
  throw new Error("Es necesario la variable de entorno VERIFY_TOKEN")
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
  var senderID      = event.sender.id;
  var recipientID   = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message       = event.message;

  console.log(
    "Received message for user %d and page %d at %d with message:",
    senderID,
    recipientID,
    timeOfMessage
  );
  
  var isEcho    = message.is_echo;
  var messageId = message.mid;
  var appId     = message.app_id;
  var metadata  = message.metadata;

  // You may get a text or attachment but not both
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log(
      "Received echo for message %s and app %d with metadata %s",
      messageId,
      appId,
      metadata
    );
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log(
      "Quick reply for message %s with payload %s",
      messageId,
      quickReplyPayload
    );
    
    
    if(!isJson(quickReplyPayload)){
      console.log("PAYLOAD no es JSON",quickReplyPayload);
      return;
    }
    
    let quickReplyPayloadParsed = JSON.parse(quickReplyPayload);
    
    switch(quickReplyPayloadParsed.event){
      case "QR_APPROVE_ISSUE":
        let issueCodeA = quickReplyPayloadParsed.params.issueCode;
        let messageA = `El ticket ${issueCodeA} ha sido aprobado y se notificara a los interesados, mas detallers en el tablero http://jira.lima.bcp.com.pe`
        facebookGraphService.sendTextMessage(senderID,messageA)
        break;
      case "QR_DECLINE_ISSUE":
        let issueCodeD = quickReplyPayloadParsed.params.issueCode;
        let messageD = `El ticket ${issueCodeD} ha sido rechazado y se notificara a los interesados, mas detallers en el tablero http://jira.lima.bcp.com.pe`
        facebookGraphService.sendTextMessage(senderID,messageD)
        break;
      default:
        console.log("Quick reply tapped", senderID, quickReplyPayload);
        break;
    }
    return;
  } else {
    if (senderID) {
      var CHAT_ID_USER = senderID;
      facebookGraphService.sendStartSurvey(senderID);
    }
  }
}

const postBacks = {
  "START_MENU"  : require("../postbacks/startMenu"),
  "CHECK_ISSUES":require("../postbacks/checkIssues"),
  "VIEW_ISSUE"  :require("../postbacks/viewIssue")
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
