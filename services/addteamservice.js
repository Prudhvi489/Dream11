// const  mongoconnection  = require("../database/mongoconnection");
// const {db}=require('../index')
const { connectdb } = require("../database/mongoconnection");
const { add_teammembers_helper, checkMaxPlayersPerTeam } = require("../utils/helpers/helperfunctions");

const addteamservice = {
    /**
     * 
     * @param {object} payload 
     * @returns json object
     */
  addteammembers: async (payload) => {
    try {
      const { teamname, players, vicecaptain, captain } = payload;
      let all_players = [...players, vicecaptain, captain];
      /**Maximum players check */
      const teams_check = await checkMaxPlayersPerTeam(all_players);
      if (teams_check.length > 0) {
        return {
          statu: 0,
          message: "Max players per team reached",
          data: {
          },
        };
      }
      /**Captain duplication checking */
      const captain_duplicate = [...players, vicecaptain].some((player) => {
        return JSON.stringify(player) === JSON.stringify(captain);
      });
      if (captain_duplicate) {
        return {
          statu: 0,
          message: "captain found in vicecaptain/players",
          data: {
            val: "Duplicate captain not allowed",
          },
        };
      }
      /**vice captain duplication checking */
      const vicecaptain_duplicate = [...players, captain].some((item) => {
        return JSON.stringify(item) === JSON.stringify(vicecaptain);
      });
      if (vicecaptain_duplicate) {
        return {
          statu: 0,
          message: "vicecaptain found in captain/players",
          data: {
            val: "Duplicatevicecaptain not allowed",
          },
        };
      }

      let db = await connectdb();

      const playerscollection = db.collection("playerslist");
      // Aggregation pipeline to match players based on the provided array of objects
      const pipeline = [
        {
          $match: {
            $or: all_players.map((player) => ({
              Player: player.Player,
              Team: player.Team,
              Role: player.Role,
            })),
          },
        },
        {
          $group: {
            _id: null,
            // playerIds: { $addToSet: "$_id" },
            players: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
      ];
      // Execute the aggregation pipeline
      const result = await playerscollection.aggregate(pipeline).toArray();
      // Check if all players are found
      if (result.length === 0 || result[0].count !== all_players.length) {
        return {
          statu: 0,
          message: "Invalid players",
          data: {
            val: result,
          },
        };
      }
      const teamsmember_res = await add_teammembers_helper(
        result[0]?.players,
        captain,
        vicecaptain
      );
      const registered_team = {
        TeamName: teamname,
        Players: teamsmember_res.playersObj,
        Captain: teamsmember_res.captainObj._id,
        ViceCaptain: teamsmember_res.viceCaptainObj._id,
      };
      // Check if the team name already exists in the collection
        const existingTeam =await db.collection("teams").findOne({ TeamName: teamname });
        console.log(existingTeam,"team")
        if(existingTeam){
            return {
                statu: 0,
                message: "Team name already exists",
                data: {
                },
              };
        }
      const teamcollection = db.collection("teams").insertOne(registered_team);

      return {
        status: 1,
        message: "Team registered successfully",
        data: { val: result[0]?.players },
      };
    } catch (err) {
      console.log(err);
    }
  },
};
module.exports = { addteamservice };
