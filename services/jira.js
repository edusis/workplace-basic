const request = require("request");
const noop    = require("../utils/noop");

const JIRA_SERVER_URL    = process.env.JIRA_SERVER_URL || "https://jira.devopsdesa.credito.bcp.com.pe";
const JIRA_USER_NAME     = process.env.JIRA_ADMIN || "jiraadmin";
const JIRA_USER_PASSWORD = process.env.JIRA_PASSWORD || "jiraadmin"
const JIRA_PROJECT_KEY   = process.env.JIRA_PROJECT_KEY || "ACR" 

const JIRA_PENDING_APPROVE_STATUS = process.env.JIRA_PENDING_APPROVE_STATUS || "10403"

function JiraService(){
    if(!JIRA_SERVER_URL){
        throw new Error("Se tiene que setear la variable de entorno JIRA_SERVER_URL");
    }
    
    if(!JIRA_USER_NAME){
        throw new Error("Se tiene que setear la variable de entorno JIRA_USER_NAME")
    }
    
    if(!JIRA_USER_PASSWORD){
        throw new Error("Se tiene que setear la variable de entorno JIRA_USER_PASSWORD");
    }
}

JiraService.prototype.doTransition = function(issueCode,transitionId,comment,callback){
    callback = callback || noop;
    
    request.post({
        url : `${JIRA_SERVER_URL}/rest/api/2/issue/${issueCode}/transitions?expand=transitions.fields`,
        rejectUnauthorized: false,
        auth:{
            "user"    :JIRA_USER_NAME,
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
            return callback(null,response);
        }
    });
}

JiraService.prototype.getIssuesPendingToApprove = function(callback){
    request.post({
        url : `${JIRA_SERVER_URL}/rest/api/2/search`,
        rejectUnauthorized: false,
        auth:{
            "user"    :JIRA_USER_NAME,
            "password":JIRA_USER_PASSWORD
        },
        json:{
            "jql"   : `project=${JIRA_PROJECT_KEY} AND status=${JIRA_PENDING_APPROVE_STATUS}`,
            "fields": ["id","key","self","description","summary","creator","assignee","reporter","created"]
        }
    },function(error,response,body){
        if(error){
            return callback(error);
        }else{
            if(response.statusCode != 200){
                return callback(new Error("No se pudieron obtener los issues pendientes a aprobacion"));
            }   
            return callback(null,body || []);
        }
    });
}

JiraService.prototype.getIssueById = function(issueId,callback){
    request.get({
        url : `${JIRA_SERVER_URL}/rest/api/2/issue/${issueId}`,
        rejectUnauthorized: false,
        auth:{
            "user"    :JIRA_USER_NAME,
            "password":JIRA_USER_PASSWORD
        },
        qs:{
            "fields": "id,key,self,description,summary,creator,assignee,reporter,created"
        }
    },function(error,response,body){
        if(error){
            return callback(error);
        }else{
            if(response.statusCode != 200){
                return callback(new Error("No se pudieron obtener los issues pendientes a aprobacion"));
            }   
            return callback(null,body || {});
        }
    });    
}

module.exports = new JiraService();


    