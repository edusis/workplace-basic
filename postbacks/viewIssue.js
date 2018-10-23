const asyncLib             = require("async");
const facebookGraphService = require("../services/facebook_graph");
const jiraService          = require("../services/jira");

module.exports = function(event){
    let senderID      = event.sender.id;
    let payload       = event.postback.payload;
    
    let payloadParsed = JSON.parse(payload);
    let issueId       = payloadParsed.params["issueId"];
    
    asyncLib.waterfall([
        function(next){
            return jiraService.getIssueById(issueId,next)
        },
        function(rawIssue,next){
            return facebookGraphService.sendIssueQuickReply(senderID,rawIssue,"",next)            
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