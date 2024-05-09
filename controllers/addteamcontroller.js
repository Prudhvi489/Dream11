const {addteamservice} = require('../services/addteamservice')

const addteamcontroller ={
    /**
     * Adding teammembers to the game 
     * @param {object} req - teamname,players(array),captain,vice-captain 
     * @param {*} res 
     */
    addteammembers:async(req,res)=>{
        try{
            const {body} = req;
            const addres =  await addteamservice.addteammembers(body);
            // res.json({statu:1,data:{
            //     val:"succress"
            // }})
            res.json(addres)
        }
        catch(err){
            console.log(err)
        }
    }
}
module.exports = {addteamcontroller}