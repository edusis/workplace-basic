const userService = require("../services/user");
const facebookGraphService = require("../services/facebook_graph");


module.exports = function(event){
    let senderID      = event.sender.id;
    let recipientID   = event.recipient.id;
    let timeOfMessage = event.timestamp;
    
    //userService.registerUser();
    facebookGraphService.sendMenu(senderID);
}