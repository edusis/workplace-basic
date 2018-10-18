const facebookGraphService = require("../services/facebook_graph");

module.exports = function(event){
    let senderID      = event.sender.id;
    let recipientID   = event.recipient.id;
    let timeOfMessage = event.timestamp;
    
    //TODO: AQUI SE DEBE SACAR TODOS LOS ISSUES ASIGNADOS AL USUARIO QUE ESTA PREGUNTANDO Y ENVIARLOS A WP
    facebookGraphService.sendIssues(senderID,[]);
}