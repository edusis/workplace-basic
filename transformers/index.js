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

module.exports = new Transformers();