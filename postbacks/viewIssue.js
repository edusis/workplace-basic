const asyncLib             = require("async");
const facebookGraphService = require("../services/facebook_graph");
const jiraService          = require("../services/jira");

module.exports = function(event){
    let senderID      = event.sender.id;
    let recipientID   = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let payload       = event.postback.payload;
    
    let payloadParsed = JSON.parse(payload);
    let issueCode     = payloadParsed.params["issueCode"];
    let issueId       = payloadParsed.params["issueId"];
    
    asyncLib.waterfall([
        function(next){
            return jiraService.getIssueById(issueId,next)
        },
        function(rawIssue,next){
            let issueCode  = rawIssue["key"];
            let issueId    = rawIssue["id"];
            let issueLink  = rawIssue["self"];
            let summary    = rawIssue["fields"]["summary"];
            let reporter   = rawIssue["fields"]["reporter"];
            let creator    = rawIssue["fields"]["creator"];
            let assignee   = rawIssue["fields"]["assignee"];
            let created_at = rawIssue["fields"]["created"];
            let description = rawIssue["fields"]["description"];
            
            let messageV      = ""
            
            if(issueCode){
                messageV+=`* Codigo: ${issueCode}\n`
            }
            
            if(reporter){
                messageV+=`* Solicitante: ${reporter.displayName}\n`
            }
            
            if(assignee){
                messageV+=`* AgileOps: ${assignee.displayName}\n`
            }
            
            if(summary){
                messageV+=`* Resumen: ${summary}\n`
            }
            
            if(description){
                messageV+=`* Descripcion: ${description}\n`
            }
            
            facebookGraphService.sendIssueQuickReply(senderID,messageV,issueId,issueCode,next)            
        }
    ],
    function(err,response){
        if(err){
            console.error(err);
        }else{
            console.log("Proceso viewIssue termino exitoso");
        }
    });
}