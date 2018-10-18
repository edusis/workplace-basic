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
  let toStatus = data.transition.to_status;
  let issueId = data.issue.id;
  let issueCode = data.issue.key;
  let issueDescription = data.issue.fields.description;
  let summary = data.issue.fields.summary;
  let issueUrl = data.issue.self;
  
  
  console.log(fromStatus,toStatus,issueId,issueCode,issueDescription,summary);
  return res.sendStatus(200);
  //TODO: AQUI SE DEBE HACER MATCH DEL CORREO DEL USUARIO CON UN ID GUARDADO EN LA BASE DE DATOS Y ENVIARLE UN MENSAJE
  //facebookGraphService.sendTextMessage(CHAT_ID_USER, CHAT_MESSAGE);
});

router.get("/",function(req,res){
  return res.send("wat-jira");
})



