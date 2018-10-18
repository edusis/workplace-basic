"use strict";
const facebookGraphService = require("../services/facebook_graph");

const router = require("express").Router();

module.exports = router

router.post("/", function(req, res) {
  let data  = req.body;
  if(!data.transition){
    return res.sendStatus(200)
  }
  
  let fromStatus = data.transition.from_status;
  let toStatus   = data.transition.to_status;
  let issueId    = data.issue.id;
  let issueCode  = data.issue.key;
  let summary    = data.issue.fields.summary;
  let issueUrl   = data.issue.self;
  let reporter   = data.issue.reporter;
  let assignee   = data.issue.assignee;
  
  let messageText = `* Codigo: ${issueCode}`
  
  messageText +=`\n* Proyecto: BMDL`
  
  console.log(reporter);
  console.log(assignee);
  if(reporter){
    messageText+=`\n* Solicitante: Claudio Solis`  
  }
  
  if(assignee){
    messageText+=`\n* AgileOps: Miguel Canchica`  
  }
  
  if(summary){
    messageText+=`\n* ${summary}`
  }

  let testId = "100029033602415"
  
  //TODO: AQUI SE DEBE HACER MATCH DEL CORREO DEL USUARIO CON UN ID GUARDADO EN LA BASE DE DATOS Y ENVIARLE UN MENSAJE
  //userService.getUserByEmail()..;
  
  facebookGraphService.sendTextMessage(testId, messageText);
  
  console.log(fromStatus,toStatus,issueId,issueCode,summary);
  return res.sendStatus(200);
});

router.get("/",function(req,res){
  return res.send("wat-jira");
})



