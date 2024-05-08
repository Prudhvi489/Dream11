const {addteamservice} = require('../services/addteamservice')

const addteamcontroller ={
    /**
     * Adding teammembers to the game 
     * @param {object} req - teamname,players(array),captain,vice-captain 
     * @param {*} res 
     */
    addteammembers:async(req,res)=>{
        try{
            console.log(req?.body,"asds")
            const {body} = req;
            const addres =  await addteamservice.addteammembers(body);
            res.json({statu:1,data:{
                val:"succress"
            }})
        }
        catch(err){
            console.log(err)
        }
    }
}
module.exports = {addteamcontroller}