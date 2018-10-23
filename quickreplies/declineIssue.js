"use strict";
const asyncLib             = require("async");
const jiraService          = require("../services/jira");
const facebookGraphService = require("../services/facebook_graph");

const TRANSITION_ID = "211";

module.exports = function(event){
    let senderId      = event.sender.id;
    let payload       = event.message.quick_reply.payload;
    
    let payloadParsed = JSON.parse(payload);
    let issueCode    = payloadParsed.params["issueCode"];
    let issueId      = payloadParsed.params["issueId"];
    
    asyncLib.waterfall([
        function(next){
            facebookGraphService.getUser(senderId,function(error,user){
                if(error){
                    return next(error);
                }
                
                let comment = `Observado por ${user.name} usando Release Bot`;
                return jiraService.doTransition(issueCode,TRANSITION_ID,comment,next);    
            });
        },
        function(response,next){
            jiraService.getIssueById(issueId,function(err,issueRaw){
                if(err){
                    return next(err);
                }
                
                let facebookMessage = `El issue ${issueCode} ha sido observado y se notificara a los interesados, más detalles en ${issueRaw.self}`
                return facebookGraphService.sendTextMessage(senderId,facebookMessage,next)
            });
        }
    ],
    function(err){
        if(err){
            console.error(err);
        }else{
            console.log("Termino el proceso de rechazo")
        }   
    });
}