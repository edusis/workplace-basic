const request    = require("request");

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

function callSendAPI(messageData) {
  request(
    {
      baseUrl: GRAPH_API_BASE,
      url: "/me/messages",
      qs: { access_token: ACCESS_TOKEN },
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
      } else {
        console.error(
          "Failed calling Send API",
          response.statusCode,
          response.statusMessage,
          body.error
        );
      }
    }
  );
}


FacebookGraph.prototype.sendDelaySurvey= function(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "No problem, we'll try again tomorrow"
    }
  };

  callSendAPI(messageData);
}


FacebookGraph.prototype.sendThankYou = function(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text:
        "Thanks for your feedback! If you have any other comments, write them below."
    }
  };

  callSendAPI(messageData);
}


FacebookGraph.prototype.sendFirstQuestion = function (recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text:
        "Between 1 and 5, where 5 is 'Very Happy', how happy are you working here?",
      quick_replies: [
        {
          content_type: "text",
          title: "☹️ 1",
          payload: "HAPPY:1"
        },
        {
          content_type: "text",
          title: "2",
          payload: "HAPPY:2"
        },
        {
          content_type: "text",
          title: "3",
          payload: "HAPPY:3"
        },
        {
          content_type: "text",
          title: "4",
          payload: "HAPPY:4"
        },
        {
          content_type: "text",
          title: "5 😃",
          payload: "HAPPY:5"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

FacebookGraph.prototype.sendFirstACR = function (recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "" + "hello",
      quick_replies: [
        {
          content_type: "text",
          title: "SI",
          payload: "ACRYES"
        },
        {
          content_type: "text",
          title: "NO",
          payload: "ACRNO"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

FacebookGraph.prototype.sendStartSurvey = function (recipientId) {
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

      callSendAPI(messageData);
    }
  );
}

FacebookGraph.prototype.sendTextMessage = function(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}


FacebookGraph.prototype.sendMenu = function(recipientId){
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
                "title":"Ver mis tareas asignadas",
                "payload":"{\"event\":\"CHECK_ISSUES\"}"
              }              
            ]      
          }
        ]
      }
    }
  }
}
  callSendAPI(messageData);
}


FacebookGraph.prototype.sendIssues = function(recipientId, rawIssues){
    
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
            "title":"BMDL | ACR-1",
            "subtitle":"Generacion de Endpoint para NHBK",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-1\"}}"
              } 
            ]      
          },
           {
            "title":"BMDL | ACR-2",
            "subtitle":"Creacion de contenedor con SQL Server Client",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-2\"}}"
              } 
            ]      
          },
           {
            "title":"BMDL | ACR-3",
            "subtitle":"Reinicio de JIRA para la sincronizacion de usuarios",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-3\"}}"
              } 
            ]      
          }
        ]
      }
    }
  }
}
  callSendAPI(messageData);
}




FacebookGraph.prototype.sendIssue = function(recipientId, rawIssues){
    
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
            "title":"Proyecto: BMDL | ACR-1",
            "subtitle":"* Descripcion: Esta es una descripcion \n * Usuario pedido: Aaron Castillo Rodriguez \n * Proyecto: BMDL",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-1\"}}"
              } 
            ]      
          },
           {
            "title":"Proyecto: BMDL | ACR-1",
            "subtitle":"* Descripcion: Esta es una descripcion \n * Usuario pedido: Aaron Castillo Rodriguez \n * Proyecto: BMDL",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-2\"}}"
              } 
            ]      
          },
           {
            "title":"Proyecto: BMDL | ACR-1",
            "subtitle":"* Descripcion: Esta es una descripcion \n * Usuario pedido: Aaron Castillo Rodriguez \n * Proyecto: BMDL",
            "buttons":[
              /*
              {
                "type":"postback",
                "title":"Aprobar",
                "payload":"{'event':'APPROVE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              {
                "type":"postback",
                "title":"Rechazar",
                "payload":"{'event':'DECLINE','params':{'issueId':1231,'issueCode':'ACR-1'}}"
              },
              */
              {
                "type":"postback",
                "title":"Ver detalle",
                "payload":"{\"event\":\"VIEW_ISSUE\",\"params\":{\"issueId\":1231,\"issueCode\":\"ACR-3\"}}"
              } 
            ]      
          }
        ]
      }
    }
  }
}
  callSendAPI(messageData);
}

FacebookGraph.prototype.sendIssueQuickReply = function(recipientId,messageText,issueId,issueCode){
    
   let messageData = {
    "recipient":{
      "id":recipientId
    },
    "message":{
      "text": messageText,
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Aprobar",
          "payload":`{\"event\":\"QR_APPROVE_ISSUE\",\"params\":{\"issueId\":\"${issueId}\",\"issueCode\":\"${issueCode}\"}}`,
        },
        {
          "content_type":"text",
          "title":"Rechazar",
          "payload":`{\"event\":\"QR_DECLINE_ISSUE\",\"params\":{\"issueCode\":\"${issueCode}\"}}`,
        },
        {
          "content_type":"text",
          "title":"Cancelar",
          "payload":`{\"event\":\"QR_CANCEL\",\"params\":{\"issueCode\":\"${issueCode}\"}}`,
        }
      ]
    }
  }
  callSendAPI(messageData);
}



