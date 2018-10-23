const noop         = require("../utils/noop");
const transformers = require("../transformers");
const request      = require("request");


const GRAPH_API_BASE = "https://graph.facebook.com/v2.6";
const ACCESS_TOKEN   = process.env.ACCESS_TOKEN || null

function FacebookGraph(){
  if(!ACCESS_TOKEN){
    throw new Error("Es necesario la variable de entorno ACCESS_TOKEN")
  }
}

module.exports = new FacebookGraph()


FacebookGraph.prototype.ACCESS_TOKEN = ACCESS_TOKEN;
FacebookGraph.prototype.GRAPH_API_BASE = GRAPH_API_BASE;

function callSendAPI(messageData,callback) {
  callback = callback || noop;
  
  request(
    {
      baseUrl: GRAPH_API_BASE,
      url: "/me/messages",
      qs: { 
        access_token: ACCESS_TOKEN
      },
      method: "POST",
      json: messageData
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log(
            "Successfully sent message with id %s to recipient %s",
            messageId,
            recipientId
          );
        } else {
          console.log(
            "Successfully called Send API for recipient %s",
            recipientId
          );
        }
        
        return callback();
      } else {
        console.error(
          "Failed calling Send API",
          response.statusCode,
          response.statusMessage,
          body.error
        );
        
        return callback(error);
      }
    }
  );
}

/*
FacebookGraph.prototype.sendStartSurvey = function (recipientId,callback) {
  console.log("sendStartSurvey")
  request(
    {
      baseUrl: GRAPH_API_BASE,
      url: "/" + recipientId,
      qs: {
        fields: "first_name"
      },
      auth: { bearer: ACCESS_TOKEN }
    },
    function(error, response, body) {
      if(error){
        console.log(error);
      }
      console.log(body);
      body = JSON.parse(body);
      var messageData = {
        recipient: {
          id: body.id
        },
        message: {
          text: `Hola ${
            body.first_name
          }, Desea leer el ultimo ACR del tablero?`,
          quick_replies: [
            {
              content_type: "text",
              title: "Si",
              payload: "START_SURVEY"
            },
            {
              content_type: "text",
              title: "No",
              payload: "DELAY_SURVEY"
            }
          ]
        }
      };

      callSendAPI(messageData,callback);
    }
  );
}
*/

FacebookGraph.prototype.sendTextMessage = function(recipientId, messageText,callback) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData,callback);
}


FacebookGraph.prototype.sendMenu = function(recipientId,callback){
  let messageData = {
  "recipient":{
    "id":recipientId
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Bienvenido!",
            "subtitle":"En que te puedo ayudar?",
            "buttons":[
              {
                "type":"postback",
                "title":"Ver issues pendientes",
                "payload":"{\"event\":\"CHECK_ISSUES\"}"
              }              
            ]      
          }
        ]
      }
    }
  }
}
  callSendAPI(messageData,callback);
}


FacebookGraph.prototype.sendIssues = function(recipientId, rawIssues,callback){
  let elements   = transformers.rawIssuesToFacebook(rawIssues);
  let messageData= {
    "recipient":{
      "id":recipientId
    },
    "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements"     :elements
        }
      }
    }
  }
  callSendAPI(messageData,callback);
}

FacebookGraph.prototype.sendIssueQuickReply = function(recipientId,rawIssue,callback){
  let transformed = transformers.rawIssueToQuickReply(rawIssue);
  let messageData = {
    "recipient":{
      "id":recipientId
    },
    "message":transformed
  }
  
  callSendAPI(messageData,callback);
}



