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
  let rawIssue   = data.issue

  let messageText = "Tienes un nuevo issue pendiente de aprobación \n"
  
  let groupIds = "100029033602415"
  
  //TODO: AQUI SE DEBE HACER MATCH DEL CORREO DEL USUARIO CON UN ID GUARDADO EN LA BASE DE DATOS Y ENVIARLE UN MENSAJE
  //userService.getUserByEmail()..;

  facebookGraphService.sendIssueQuickReply(groupIds,rawIssue,messageText);
  
  return res.sendStatus(200);
});

router.get("/",function(req,res){
  return res.send("wat-jira");
})



