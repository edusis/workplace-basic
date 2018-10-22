"use strict";
const asyncLib             = require("async");
const jiraService          = require("../services/jira");
const facebookGraphService = require("../services/facebook_graph");

const TRANSITION_ID = "111";

module.exports = function(event){
    let senderID      = event.sender.id;
    let payload       = event.message.quick_reply.payload;
    
    let payloadParsed = JSON.parse(payload);
    let issueCode    = payloadParsed.params["issueCode"];
    let issueId      = payloadParsed["issueId"];
    
    let facebookMessage = `El ticket ${issueCode} ha sido aprobado y se notificara a los interesados, 
    mas detallers en el tablero http://jira.lima.bcp.com.pe`
    
    let comment = "Se rechazo por seguridad usando Release Bot";
    
    asyncLib.waterfall([
        function(next){
            //TODO: AQUI SE DEBE OBTENER LA INFO DEL USUARIO DE ALGUNA FORMA Y PONER EN EL COMENTARIO
            //TODO: PARALELALMENTE SE PODRIA SACAR EL ISSUE
            let comment = "Se aprobo por seguridad usando Release Bot";
            return next(null,comment);
        },
        function(comment,next){
            return jiraService.doTransition(issueCode,TRANSITION_ID,comment);
        },
        function(response,next){
            //TODO: AQUI SE DEBE ENVIAR EL MENSAJE DE CONFIRMACION AL USUARIO     
            facebookGraphService.sendTextMessage(senderID,facebookMessage,next)
        }
    ],
    function(err){
        if(err){
            console.error(err);
        }    
    });
}