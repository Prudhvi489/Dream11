const {resultsservice} = require('../services/resultsservice');
const responseHandlers = require('../utils/responseHandler')
const resultscontroller = {
    /**
     * Processing the results using match.json file
     * @param {object} req 
     * @param {*} res 
     */
    processresults:async(req,res)=>{
        try{
            const match_process =  await resultsservice.processresults();
            const {message,data={}}= match_process;
            if(match_process===-1){
                responseHandlers.internalServerError(res,"Error in processing the results")
            }
            else{
                responseHandlers.success(res,message,data)
            }
        }
        catch(err){
            console.log(err);
            responseHandlers.internalServerError(res,"Error in processing the results")
        }
    },
    /**
     * Retrieving the processed results and diplaying the winners
     * @param {object} req 
     * @param {*} res 
     */
    getmatchresults:async(req,res)=>{
        try{
            const match_result = await resultsservice.getmatchresults();
            const {message,data={}} = match_result;
            if(match_result===-1){
                responseHandlers.internalServerError(res,"Error in getting the results")
            }
            else{
                responseHandlers.success(res,message,data)
            }
        }
        catch(err){
            responseHandlers.internalServerError(res,"Error in getting the results") 
        }
    }

}
module.exports ={resultscontroller}