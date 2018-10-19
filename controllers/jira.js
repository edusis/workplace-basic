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
  let reporter   = data.issue.fields.reporter;
  let assignee   = data.issue.fields.assignee;
  
  let messageText = "Tienes un nuevo issue pendiente de aprobacion \n"
  
  console.log(data.issue.fields);
  if(issueCode){
    messageText+=`* Codigo: ${issueCode}`
  }
  
  if(reporter){
    messageText+=`\n* Solicitante: ${reporter.displayName}`  
  }
  
  if(assignee){
    messageText+=`\n* AgileOps: Miguel Canchica`  
  }
  
  if(summary){
    messageText+=`\n* Resumen: ${summary}`
  }

  let testId = "100029033602415"
  
  //TODO: AQUI SE DEBE HACER MATCH DEL CORREO DEL USUARIO CON UN ID GUARDADO EN LA BASE DE DATOS Y ENVIARLE UN MENSAJE
  //userService.getUserByEmail()..;
  console.log(reporter);
  console.log(assignee);
  console.log(fromStatus,toStatus,issueId,issueCode,summary);
  
  facebookGraphService.sendIssueQuickReply(testId, messageText);
  
  return res.sendStatus(200);
});

router.get("/",function(req,res){
  return res.send("wat-jira");
})



