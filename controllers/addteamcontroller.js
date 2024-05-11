const { addteamservice } = require("../services/addteamservice");
const responseHandlers = require("../utils/responseHandler");
const addteamcontroller = {
  /**
   * Adding teammembers to the game
   * @param {object} req - teamname,players(array),captain,vice-captain
   * @param {*} res
   */
  addteammembers: async (req, res) => {
    try {
      const { body } = req;
      const addres = await addteamservice.addteammembers(body);

      const { message, data = {} } = addres;
      if (addres === -1) {
        return responseHandlers.internalServerError(res, "Something went wrong");
      } else {
        return responseHandlers.success(res, message, data);
      }
    } catch (err) {
      console.log(err);
      let message = "Something went wrong";
      return responseHandlers.internalServerError(res, message);
    }
  },
};
module.exports = { addteamcontroller };
