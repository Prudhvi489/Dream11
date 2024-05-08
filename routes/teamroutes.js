const teamvalidation = require('../utils/validations/teamvalidation')
const {addteamcontroller} = require('../controllers/addteamcontroller');
const {resultscontroller} = require('../controllers/resultscontroller');
module.exports = (router) =>{
    router.post("/add-team",teamvalidation.validateaddteam,addteamcontroller.addteammembers);
    router.get("/process-result",resultscontroller.processresults);
    router.get("/team-result",resultscontroller.getmatchresults)
};