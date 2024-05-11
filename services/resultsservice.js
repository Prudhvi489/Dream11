const matches_data = require("../data/match.json");
const { connectdb } = require("../database/mongoconnection");
const { matches_score_analysis, display_match_results } = require("../utils/helpers/helperfunctions");

const resultsservice = {
  /**
   * 
   * @param {object} payload 
   * @returns 
   */
  processresults: async (payload) => {
    try {
      let match_players = {};
      let match_res = {
        match: "663de5f77ec0232f4f94a5b0_663de7397ec0232f4f94a5b1",
        Firstinnings: {
          teamname: "",
          total: 0,
          overscore: 0,
          bowlers_inover: 0,
          prev_bowler: "",
          playersscores:{}
        },
        Secondinnings: {
          teamname: "",
          total: 0,
          overscore: 0,
          bowlers_inover: 0,
          prev_bowler: "",
          playersscores:{}
        },
      };
      let db = await connectdb();
      for (let ball = 0; ball <= matches_data.length - 1; ball++) {
        let each_ball = matches_data[ball];
        let innings_key =
          each_ball?.innings === 1 ? "Firstinnings" : "Secondinnings";
        const { batter, BattingTeam } = each_ball;

        const pipeline = [
          // Match documents with the provided teamname
          { $match: { TeamName: BattingTeam } },
          // Unwind the Players array to access each player individually
          { $unwind: "$Players" },
          // Match documents where the player is either in Players, Captain, or Vicecaptain
          {
            $match: {
              $or: [
                { "Players.Player": batter },
                { "Captain.Player": batter },
                { "Vicecaptain.Player": batter },
              ],
            },
          },
          // Project only the matched player object
          {
            $project: {
              _id: 0,
              matchedPlayer: {
                $cond: [
                  { $eq: ["$Players.Player", batter] },
                  "$Players",
                  {
                    $cond: [
                      { $eq: ["$Captain.Player", batter] },
                      "$Captain",
                      "$Vicecaptain",
                    ],
                  },
                ],
              },
            },
          },

          // Unwind the matchedPlayer array if it's an array
          { $unwind: "$matchedPlayer" },
        ];

        const teamsCollection = await db.collection("teams");
        try {
          const result = await teamsCollection.aggregate(pipeline).toArray();
          // Check if the player is present in any team
          if (result.length > 0) {
            let analysis_res = await matches_score_analysis({
              matchobj: match_res,
              scoreobj: each_ball,
              playerobj: result[0]?.matchedPlayer,
              inningskey: innings_key,
            });
            match_res = analysis_res; // Do something if the player is present
          } else {
            continue;
            // Do something if the player is not present
          }
        } catch (err) {
          return {status:0,message:"Error while processing results",data:{}}
        }
      }
      let current_date = new Date();
      let formate_date = `${current_date.getDate()}/${
        current_date.getMonth() + 1
      }/${current_date.getFullYear()}`;
      console.log(`${match_res.match}_${formate_date}`, "key");
      let unique_key = `${match_res.match}_${formate_date}`;
      // Assuming match_res is your document and match_res.match is the key you want to use as the _id field
      let filter = { _id: unique_key };
      // Set the replacement document
      let replacement = match_res;
      // Options to upsert (insert if not exists)
      let options = { upsert: true };
      let match_processed_result = await db
        .collection("matchresults")
        .updateOne(filter, { $set: replacement }, options);
      return { status: 1, message: "Results processed succesfully", data: {} };
    } catch (err) {
      return {status:0,message:"Error while processing results",data:{}}
    }
  },
  /**retrieveing the processed results */
  getmatchresults: async (payload) => {
    try {
      let db = await connectdb();
      let allResults = await db.collection("matchresults").find({}).toArray();
      // console.log(allResults);
      let display_results = await display_match_results(allResults)
      return { status: 1, message: "Results fetched succesfully", data: display_results };

    } catch (err) {
      return {status:0,message:"Error in retrieving results",data:{}}
    }
  },
};
module.exports = { resultsservice };
