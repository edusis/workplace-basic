"use strict";
const facebookGraphService = require("./facebook_graph");
const botProperties = require("../data/bot_properties.json");
const request = require("request");

module.exports = function(callback){
    request.post({
        url:`${facebookGraphService.GRAPH_API_BASE}/me/messenger_profile`,
        json:botProperties,
        qs:{
            "access_token":facebookGraphService.ACCESS_TOKEN
        }
    },function(err,response,body){
        if(err){
            return callback(err);
        }else{
            return callback(null,body);
        }
    });    
}