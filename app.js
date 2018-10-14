/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  
  express = require('express');
// Using dotenv to allow local running with environment variables
require('dotenv').load();

var app = express();
app.set('port', process.env.PORT || 5000);
//app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.json());

/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables.
 *
 * APP_SECRET can be retrieved from the App Dashboard
 * VERIFY_TOKEN can be any arbitrary value used to validate a webhook
 * ACCESS_TOKEN is generated by creating a new Custom Integration
 *
 */
//
const
  APP_SECRET = "c398b81d419971b0a9e349f77af09c3f",
  VERIFY_TOKEN = "edusis_sinapsis_peru",
  ACCESS_TOKEN = "DQVJzQ0VIQ2lveERzME1VUEoweFRQc2xRVGN5Qi0zbFhNNG1nZAkJkWEU5WkVQWWVlM21GblY5SGllSDh1NzEwdE1wQnZABSGdHWnN5RkVlLWREcGp2d2V3RE0zWkktWTdrRXl4YzVfcjNmUl9KTURnVkR2ZAl9qUDVFbFJTbU9FVndseEFLdUZALVXBXdDh0UjFncWlTME8wYXlXbTFWZADhJUkJ3WGc5NV9iUXFWR1RFc1czTEZA5cmEzVHMxR19xZAEZAfSE12dzZAB";



if (!(APP_SECRET && VERIFY_TOKEN && ACCESS_TOKEN)) {
  console.error('Missing config values');
  process.exit(1);
}
const GRAPH_API_BASE = "https://graph.facebook.com/v2.6";
/*
 * Check that the verify token used in the Webhook setup is the same token
 * used here.
 *
 */
app.get('/', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.log("Call by GET:",req.query);
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});


/*
 * All callbacks for webhooks are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks.
 *
 * On Workplace, webhooks can be sent for 'page', 'group' and
 * 'workplace_security' objects:
 *
 * 'Page' webhooks relate to page messages or mentions, where the page ID is
 * the ID of the bot the user is interacting with.
 *
 * 'Group' webhooks relate to updates in a specific Workplace group, including
 * posts, comments and group membership changes.
 *
 * 'Workplace Security' webhooks relate to security-specific events in
 * Workplace, including login, logout, password changes etc.
 *
 * https://developers.facebook.com/docs/workplace/integrations/custom-integrations/webhooks
 *
 */
app.post('/', function (req, res) {
  try{
    var data = req.body;
    // On Workplace, webhooks can be sent for page, group, user and
		// workplace_security objects
    switch (data.object) {
    case 'page':
      processPageEvents(data);
      break;
    case 'group':
      processGroupEvents(data);
      break;
    case 'user':
      processUserEvents(data);
      break;
    case 'workplace_security':
      processWorkplaceSecurityEvents(data);
      break;
    default:
      console.log('Unhandled Webhook Object', data.object);
    }
  } catch (e) {
    // Write out any exceptions for now
    console.log("Call POST2:");
    console.error(e);
  } finally {
    // Always respond with a 200 OK for handled webhooks, to avoid retries
    // from Facebook
    console.log("Call POST3:");
    res.sendStatus(200);
  }

});

function processPageEvents(data) {
  data.entry.forEach(function(entry){
    let page_id = entry.id;
		// Chat messages sent to the page
    if(entry.messaging) {
      entry.messaging.forEach(function(messaging_event){

        console.log('Page Messaging Event',page_id,messaging_event);
        if (messaging_event.message) {
          receivedMessage(messaging_event);
        }

      });
    }
		// Page related changes, or mentions of the page
    if(entry.changes) {
      entry.changes.forEach(function(change){
        console.log('Page Change',page_id,change);
      });
    }
  });
}

function processGroupEvents(data) {
  data.entry.forEach(function(entry){
    let group_id = entry.id;
    entry.changes.forEach(function(change){
      console.log('Group Change',group_id,change);
    });
  });
}

function processUserEvents(data) {
  data.entry.forEach(function(entry){
    let group_id = entry.id;
    entry.changes.forEach(function(change){
      console.log('User Change',group_id,change);
    });
  });
}

function processWorkplaceSecurityEvents(data) {
  data.entry.forEach(function(entry){
    let group_id = entry.id;
    entry.changes.forEach(function(change){
      console.log('Workplace Security Change',group_id,change);
    });
  });
}

/*
 * Verify that the callback came from Facebook. Using the App Secret we
 * can verify the signature that is sent with each callback in the
 * x-hub-signature field, located in the header.
 *
 * More info: https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers['x-hub-signature'];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error('Couldn\'t validate the signature.');
  } else {
    var elements = signature.split('=');
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET).update(buf).digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
  }
}

/************************************************************************************/
/************************************************************************************/
/************************************************************************************/

app.get('/start/:user', function (req, res) {
  console.log('Start', req.params.user);
  sendStartSurvey(req.params.user);
  res.sendStatus(200);
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 * 
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log('Received message for user %d and page %d at %d with message:',
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log('Received echo for message %s and app %d with metadata %s',
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log('Quick reply for message %s with payload %s',
      messageId, quickReplyPayload);

    var payload_tokens = quickReplyPayload.split(':');
    var payload_action = payload_tokens[0];

    // We're using predefined metadata payloads for the quickreply messages
    // so let's use these to understand what should happen next
    switch (payload_action) {
      case 'DELAY_SURVEY':
        sendDelaySurvey(senderID);
        break;
      case 'START_SURVEY':
        sendFirstQuestion(senderID);
        break;
      case 'HAPPY':
        //sendSecondQuestion(senderID);
        break;
      case 'STAY':
        sendThankYou(senderID);
        break;
      default:
        console.log('Quick reply tapped', senderID, quickReplyPayload);
        break;
    }
    return;
  }
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendStartSurvey(recipientId) {
  request({
    baseUrl: GRAPH_API_BASE,
    url: '/' + recipientId,
    qs: {
      'fields': 'first_name'
    },
    auth: { 'bearer': ACCESS_TOKEN }
  }, function (error, response, body) {
    body = JSON.parse(body);
    var messageData = {
      recipient: {
        id: body.id
      },
      message: {
        text: `Hi ${body.first_name}, your opinion matters to us. Do you have a few seconds to answer a quick survey?`,
        quick_replies: [{
          content_type: 'text',
          title: 'Yes',
          payload: 'START_SURVEY'
        }, {
          content_type: 'text',
          title: 'Not now',
          payload: 'DELAY_SURVEY'
        }]
      }
    };

    callSendAPI(messageData);
  });
}

/*
 * Send a text message using the Send API.
 *
 */
function sendDelaySurvey(recipientId) {
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

/*
 * Send a text message using the Send API.
 *
 */
function sendThankYou(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Thanks for your feedback! If you have any other comments, write them below.'
    }
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    baseUrl: GRAPH_API_BASE,
    url: '/me/messages',
    qs: { access_token: ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log('Successfully sent message with id %s to recipient %s', messageId, recipientId);
      } else {
        console.log('Successfully called Send API for recipient %s', recipientId);
      }
    } else {
      console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
    }
  });
}


// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
