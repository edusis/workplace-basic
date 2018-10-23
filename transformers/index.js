function Transformers(){
    
}

Transformers.prototype.rawIssuesToFacebook = function(rawIssues){
    let transformed = rawIssues.map(function(rawIssue){
        let issueCode = rawIssue["key"];
        let issueId   = rawIssue["id"];
        let issueLink = rawIssue["self"];
        let summary   = rawIssue["fields"]["summary"]
        
        let payload = {
            "event":"VIEW_ISSUE",
            "params":{
                "issueId"  :issueId,
                "issueCode":issueCode
            }
        }
        
        return {
            "title": `BMDL | ${issueCode}`,
            "subtitle": summary,
            "buttons":[
                {
                    "type":"postback",
                    "title":"Ver detalle",
                    "payload": JSON.stringify(payload)
                }
            ]
        }
    });
    
    return transformed;
}

Transformers.prototype.rawIssueToQuickReply = function(rawIssue,initMessage){
    let issueCode   = rawIssue["key"];
    let issueId     = rawIssue["id"];
    let issueLink   = rawIssue["self"];
    let summary     = rawIssue["fields"]["summary"];
    let reporter    = rawIssue["fields"]["reporter"];
    let creator     = rawIssue["fields"]["creator"];
    let assignee    = rawIssue["fields"]["assignee"];
    let created_at  = rawIssue["fields"]["created"];
    let description = rawIssue["fields"]["description"];
    
    let messageV      = initMessage || ""
    
    if(issueCode){
        messageV+=`* Codigo: ${issueCode}\n`
    }
    
    if(reporter){
        messageV+=`* Solicitante: ${reporter.displayName}\n`
    }
    
    if(assignee){
        messageV+=`* AgileOps: ${assignee.displayName}\n`
    }
    
    if(summary){
        messageV+=`* Resumen: ${summary}\n`
    }
    
    if(description){
        messageV+=`* Descripcion: ${description}\n`
    }
    
    return {
    "text": messageV,
        "quick_replies":[
            {
                "content_type":"text",
                "title":"Aprobar",
                "payload":JSON.stringify({
                    "event":"QR_APPROVE_ISSUE",
                    "params":{"issueId":issueId,"issueCode":issueCode}
                })
            },
            {
                "content_type":"text",
                "title":"Rechazar",
                "payload":JSON.stringify({
                    "event":"QR_DECLINE_ISSUE",
                    "params":{"issueId":issueId,"issueCode":issueCode}
                })
            },
            {
              "content_type":"text",
              "title":"Cancelar",
              "payload":JSON.stringify({
                  "event":"QR_CANCEL",
                  "params":{"issueId":issueId,"issueCode":issueCode}
              })
            }
        ]
    };
}

module.exports = new Transformers();