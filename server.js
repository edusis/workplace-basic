"use strict";
require("dotenv").load();
const express    = require("express");
const bodyParser = require("body-parser");
const setupBot   = require("./config/bot");

let app = express();

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());

const workplaceController = require("./controllers/workplace");
const jiraController      = require("./controllers/jira");

app.use("/workplace",workplaceController);
app.use("/jira",jiraController);


console.log("Configurando de bot");
setupBot(function(err,response){
    if(err){
        throw err;
    }else{
        console.log("Configuracion terminada:")
        console.log(response);
        
        console.log("Iniciando Workplace Bot");
        
        app.listen(app.get("port"), function() {
            console.log("Workplace Bot is running on port", app.get("port"));
        });
    }
});



module.exports = app;
