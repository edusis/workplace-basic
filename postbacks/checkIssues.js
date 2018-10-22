const asyncLib             = require("async");
const facebookGraphService = require("../services/facebook_graph");
const jiraService          = require("../services/jira");

module.exports = function(event){
    let senderID      = event.sender.id;
    let recipientID   = event.recipient.id;
    let timeOfMessage = event.timestamp;
    
    asyncLib.waterfall([
        function(next){
            jiraService.getIssuesPendingToApprove(next)    
        },
        function(rawIssues,next){
            //let issues = rawIssues["issues"];
            //TODO: AQUI SE TIENE QUE MANDAR UN MENSAJE EN CASO HAYA POCOS ISSUES
            next(null,rawIssues["issues"]);
        },
        function(rawissues,next){
            facebookGraphService.sendIssues(senderID,rawissues,next);   
        }
    ],
    function(error,response){
        if(error){
            //console.error(error);
        }else{
            console.log("Proceso CheckIssues finalizo correctamente");
        }
    });
   
}