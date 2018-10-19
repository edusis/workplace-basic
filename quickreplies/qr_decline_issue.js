module.exports = function(){
    let issueCodeD = quickReplyPayloadParsed.params.issueCode;
    let messageD = `El ticket ${issueCodeD} ha sido rechazado y se notificara a los interesados, mas detallers en el tablero http://jira.lima.bcp.com.pe`
    facebookGraphService.sendTextMessage(senderID,messageD)
}