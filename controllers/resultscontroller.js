const {resultsservice} = require('../services/resultsservice')
const resultscontroller = {
    processresults:async(req,res)=>{
        try{
            res.json({statu:1,data:{
                val:"succress"
            }})
        }
        catch(err){

        }
    },
    getmatchresults:async(req,res)=>{
        try{
            res.json({statu:1,data:{
                val:"succress"
            }})
        }
        catch(err){

        }
    }

}
module.exports ={resultscontroller}