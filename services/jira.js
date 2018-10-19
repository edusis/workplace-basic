const request = require("request");


const JIRA_SERVER_URL    = "https://jira.devopsdesa.credito.bcp.com.pe";
const JIRA_USER_NAME     = "jiraadmin";
const JIRA_USER_PASSWORD = "jiraadmin"


function JiraService(){
    
}

JiraService.prototype.doTransition = function(issueCode,transitionId,comment,callback){
    console.log(JIRA_USER_NAME,JIRA_USER_PASSWORD);
    console.log(comment,transitionId);
    
    request.post({
        url : `${JIRA_SERVER_URL}/rest/api/2/issue/${issueCode}/transitions`,
        rejectUnauthorized: false,
        auth:{
            "user":JIRA_USER_NAME,
            "password":JIRA_USER_PASSWORD
        },
        json:{
            "transition": {
                "id": transitionId
            }
        }
    },function(error,response,body){
        if(error){
            return callback(error);
        }else{
            console.log(response);
            console.log(body);
            return callback(null,response);
        }
    });
}



module.exports = new JiraService();


    