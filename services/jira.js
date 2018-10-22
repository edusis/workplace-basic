const request = require("request");
const noop    = require("../utils/noop");

const JIRA_SERVER_URL    = "https://jira.devopsdesa.credito.bcp.com.pe";
const JIRA_USER_NAME     = "jiraadmin";
const JIRA_USER_PASSWORD = "jiraadmin"


function JiraService(){
    
}

JiraService.prototype.doTransition = function(issueCode,transitionId,comment,callback){
    callback = callback || noop;
    
    request.post({
        url : `${JIRA_SERVER_URL}/rest/api/2/issue/${issueCode}/transitions?expand=transitions.fields`,
        rejectUnauthorized: false,
        auth:{
            "user":JIRA_USER_NAME,
            "password":JIRA_USER_PASSWORD
        },
        json:{
            "transition": {
                "id": transitionId
            },
            "update": {
                "comment": [
                    {
                        "add": {
                            "body": comment
                        }
                    }
                ]
            }   
        }
    },function(error,response,body){
        if(error){
            return callback(error);
        }else{
            console.log(body);
            return callback(null,response);
        }
    });
}



module.exports = new JiraService();


    