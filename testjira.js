const jiraService = require("./services/jira");

let issueCode = "11267";
let transitionId = "111";
let comment = "Se aprobo por seguridad usando Release Bot";

jiraService.doTransition(issueCode,transitionId,comment,function(err,response){
    if(err){
        console.error(err);
    }
});