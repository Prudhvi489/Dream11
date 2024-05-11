const { connectdb } = require("../database/mongoconnection");
const {
  add_teammembers_helper,
  checkMaxPlayersPerTeam,
} = require("../utils/helpers/helperfunctions");

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
      let roles_count = all_players.reduce(
        (acc, curr) => {
          acc[curr.Role] += 1;
          return acc;
        },
        { "WICKETKEEPER": 0, "BATTER": 0, "ALL-ROUNDER": 0, "BOWLER": 0 }
      );
      // Check if all roles have at least 1 player
      for (let role in roles_count) {
        if (roles_count[role] < 1) {
          return {
            status: 0,
            message: `Error: ${role} must have at least 1 player.`,
            data: {},
          };
        }
      }

      // Check if all roles have at most 8 players
      for (let role in roles_count) {
        if (roles_count[role] > 8) {
          return {
            status: 0,
            message: `Error: ${role} cannot have more than 8 players.`,
            data: {},
          };
        }
      }
      /**Maximum players check */
      const teams_check = await checkMaxPlayersPerTeam(all_players);
      if (teams_check.length > 0) {
        return {
          statu: 0,
          message: "Max players per team reached",
          data: {},
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
        Captain: {
          id: teamsmember_res.captainObj._id,
          Player: teamsmember_res.captainObj.Player,
          Role: teamsmember_res.captainObj.Role,
          type: "captain",
        },
        ViceCaptain: {
          id: teamsmember_res.viceCaptainObj._id,
          Player: teamsmember_res.viceCaptainObj.Player,
          Role: teamsmember_res.viceCaptainObj.Role,
          type: "vicecaptain",
        },
      };
      // Check if the team name already exists in the collection
      const existingTeam = await db
        .collection("teams")
        .findOne({ TeamName: teamname });
      if (existingTeam) {
        
        return {
          statu: 0,
          message: "Team name already exists",
          data: {},
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
      return -1;
    }
  },
};
module.exports = { addteamservice };
