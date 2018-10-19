const jiraService = require("./services/jira");

let issueCode = "ACR-39";
let transitionId = "3";
let comment = "Se aprobo por seguridad mediante Release Bot";

jiraService.doTransition(issueCode,transitionId,comment,function(err,response){
    if(err){
        console.error(err);
    }
});