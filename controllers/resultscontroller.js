const {resultsservice} = require('../services/resultsservice')
const resultscontroller = {
    processresults:async(req,res)=>{
        try{
            const match_process =  await resultsservice.processresults()
            res.json(match_process)
        }
        catch(err){
            console.log(err)
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