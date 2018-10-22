const facebookGraphService = require("../services/facebook_graph");

module.exports = function(event){
    let senderID      = event.sender.id;
    let recipientID   = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let payload       = event.postback.payload;
    
    let payloadParsed = JSON.parse(payload);
    let issueCodeV    = payloadParsed.params["issueCode"];
    let issueIdV      = payloadParsed["issueId"];
    
    let messageV      = `* Codigo: ${issueCodeV}\n* Solicitante: Claudio Solis\n* Proyecto: BMDL\n* AgileOps: Miguel Canchica\n* Descripcion: Generacion de endpoint para NHBK`;
    
    facebookGraphService.sendIssueQuickReply(senderID,messageV,issueIdV,issueCodeV)
}