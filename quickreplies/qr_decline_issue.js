"use strict";
const asyncLib    = require("async");
const jiraService = require("../services/jira");

const TRANSITION_ID = "111";

module.exports = function(issueCode){
    let comment = "Se rechazo por seguridad usando Release Bot";
    asyncLib.waterfall([
        function(next){
            return jiraService.doTransition(issueCode,TRANSITION_ID,comment);
        },
        function(response,next){
            //TODO: AQUI SE DEBE ENVIAR EL MENSAJE DE CONFIRMACION AL USUARIO     
        }
    ],
    function(err){
        if(err){
            console.error(err);
        }    
    });
}