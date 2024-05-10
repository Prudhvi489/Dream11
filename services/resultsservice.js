const matches_data = require('../data/match.json')
const resultsservice = {
processresults:async(payload)=>{
    try{
        let match_players ={};
        let match_res = {
            match:"663cad8da551c6641bf078ac_"
        }
        for (let ball =0 ; ball <= matches_data.length-1; ball++){
            console.log(matches_data[ball])
        }
    }
    catch(err){

    }
},
getmatchresults:async(payload)=>{
    try{

    }
    catch(err){
        
    }
}
}
module.exports ={resultsservice}