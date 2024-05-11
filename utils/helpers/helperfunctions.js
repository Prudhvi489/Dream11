/**
 *
 * @param {array} players
 * @param {object} captain
 * @param {object} vicecaptain
 * @returns captain_obj,vicecaptain_obj,players_obj
 */
const add_teammembers_helper = async (players, captain, vicecaptain) => {
  const {
    Player: captainPlayer,
    Role: captainRole,
    Team: captainTeam,
  } = captain;
  const {
    Player: viceCaptainPlayer,
    Role: viceCaptainRole,
    Team: viceCaptainTeam,
  } = vicecaptain;

  const captainObj = players.find(
    (obj) =>
      obj.Player === captainPlayer &&
      obj.Role === captainRole &&
      obj.Team === captainTeam
  );
  const viceCaptainObj = players.find(
    (obj) =>
      obj.Player === viceCaptainPlayer &&
      obj.Role === viceCaptainRole &&
      obj.Team === viceCaptainTeam
  );

  const updatedPlayers = players.filter(
    (obj) => obj !== captainObj && obj !== viceCaptainObj
  );
  const playerIds = updatedPlayers.map((item) => {
    return {
      id: item._id,
      Player: item?.Player,
      Role: item.Role,
      type: "player",
    };
  });

  return { captainObj, viceCaptainObj, playersObj: playerIds };
};
/**
 *
 * @param {array} players
 * @returns integer
 */
function checkMaxPlayersPerTeam(players) {
  // Object to store counts of players per team
  const teamCounts = {};

  // Count players for each team
  players.forEach((player) => {
    const team = player.Team;
    teamCounts[team] = (teamCounts[team] || 0) + 1;
  });

  // Check if any team has more than 10 players
  const exceededTeams = Object.keys(teamCounts).filter(
    (team) => teamCounts[team] > 10
  );

  return exceededTeams;
}


const matches_score_analysis = async ({
  matchobj,
  scoreobj,
  playerobj,
  inningskey,
}) => {
  let mainmatch_obj = { ...matchobj };
  const {
    non_boundary,
    isWicketDelivery,
    total_run,
    extras_run,
    fielders_involved,
    kind,
    bowler,
    ballnumber,
    BattingTeam,
  } = scoreobj;
  let otherinnings_key =
    inningskey === "Firstinnings" ? "Secondinnings" : "Firstinnings";
  mainmatch_obj[inningskey].teamname = scoreobj?.BattingTeam;
  if (!mainmatch_obj[inningskey].playersscores.hasOwnProperty(playerobj.Player)) {
    mainmatch_obj[inningskey].playersscores[playerobj.Player] = {
      id: playerobj?.id,
      battingscore: 0,
      fieldingscore: 0,
      bowlingscore: 0,
      ballsplayed: [],
      centurybonus: 0,
      halfcenturybonus: 0,
      runsbonus: 0,
      wickets: 0,
      caughts: 0,
      Maidenbonus: 0,
      playerscore: 0,
    };
  }
  //   else if (isWicketDelivery) {
  if (fielders_involved !== "NA") {
    if (!mainmatch_obj[otherinnings_key].playersscores.hasOwnProperty(fielders_involved)) {
      mainmatch_obj[otherinnings_key].playersscores[fielders_involved] = {
        id: "",
        battingscore: 0,
        fieldingscore: 0,
        bowlingscore: 0,
        ballsplayed: [],
        centurybonus: 0,
        halfcenturybonus: 0,
        runsbonus: 0,
        wickets: 0,
        caughts: 0,
        Maidenbonus: 0,
        playerscore: 0,
      };
    }
  } else {
    if (!mainmatch_obj[otherinnings_key].playersscores.hasOwnProperty(bowler)) {
      mainmatch_obj[otherinnings_key].playersscores[bowler] = {
        id: "",
        battingscore: 0,
        fieldingscore: 0,
        bowlingscore: 0,
        ballsplayed: [],
        centurybonus: 0,
        halfcenturybonus: 0,
        runsbonus: 0,
        wickets: 0,
        caughts: 0,
        Maidenbonus: 0,
        playerscore: 0,
      };
    }
  }
  //   }
  let battingruns = 0;
  let bowlingpoints = 0;
  let fieldingpoints = 0;
  if (isWicketDelivery) {
    if (
      mainmatch_obj[inningskey].playersscores[playerobj.Player].battingscore === 0 &&
      ["BATTER", "ALL-ROUNDER", "WICKETKEEPER"].includes(playerobj?.Role)
    ) {
      battingruns = -2;
    }
    /**Bowling points for wickets */
    if (["LBW", "Bowled"].includes(kind) && kind !== "Run Out") {
      bowlingpoints = 33; //Wicket-25,lbw/bowled -8
    } else if (kind !== "Run Out") {
      bowlingpoints = 25; //Wicket-25
    }

    /**Fielding points for wickets */
    if (fielders_involved !== "NA") {
      fieldingpoints =
        kind === "caught"
          ? 8
          : kind === "Stumping"
          ? 12
          : kind === "Run Out"
          ? 6
          : 0;
      if (
        mainmatch_obj[otherinnings_key][fielders_involved]?.caughts === 3 &&
        kind === "caught"
      ) {
        fieldingpoints += 4; // caught bonus
      }
    }
  } else if (non_boundary === 1) {
    /**Boundary bonuses */
    battingruns = extras_run
      ? total_run - extras_run === 6
        ? total_run + 3
        : total_run + 1
      : total_run === 6
      ? 9
      : 5;
  } else {
    battingruns = total_run;
  }
  if (
    mainmatch_obj[inningskey].playersscores[playerobj.Player].battingscore >= 100 &&
    !mainmatch_obj[inningskey].playersscores[playerobj.Player].centurybonus
  ) {
    battingruns += 16;
    mainmatch_obj[inningskey].playersscores[playerobj.Player].centurybonus = 1;
  } else if (
    mainmatch_obj[inningskey].playersscores[playerobj.Player].battingscore >= 50 &&
    !mainmatch_obj[inningskey].playersscores[playerobj.Player].halfcenturybonus
  ) {
    battingruns += 8;
    mainmatch_obj[inningskey].playersscores[playerobj.Player].halfcenturybonus = 1;
  } else if (
    mainmatch_obj[inningskey].playersscores[playerobj.Player].battingscore >= 30 &&
    !mainmatch_obj[inningskey].playersscores[playerobj.Player].runsbonus
  ) {
    battingruns += 4;
    mainmatch_obj[inningskey].playersscores[playerobj.Player].runsbonus = 1;
  }
  /**Maidin over checkcing */
  if (total_run > 0) {
    if (ballnumber === 1) {
      mainmatch_obj[otherinnings_key].prev_bowler = bowler;
      mainmatch_obj[otherinnings_key].bowlers_inover = 1;
      mainmatch_obj[otherinnings_key].overscore = total_run;
    } else if (
      ballnumber !== 1 &&
      mainmatch_obj[otherinnings_key].prev_bowler !== bowler
    ) {
      mainmatch_obj[otherinnings_key].prev_bowler = bowler;
      mainmatch_obj[otherinnings_key].bowlers_inover = 2;
      mainmatch_obj[otherinnings_key].overscore = total_run;
    } else if (
      ballnumber !== 1 &&
      mainmatch_obj[otherinnings_key].prev_bowler === bowler
    ) {
      if (
        ballnumber === 6 &&
        mainmatch_obj[otherinnings_key].bowlers_inover === 1
      ) {
        mainmatch_obj[otherinnings_key].playersscores[bowler].Maidenbonus += 12;
        mainmatch_obj[otherinnings_key].playersscores[bowler].playerscore += 12; //maiden bonus
      } else if (
        ballnumber === 6 &&
        mainmatch_obj[otherinnings_key].bowlers_inover === 2
      ) {
        mainmatch_obj[otherinnings_key].overscore = 0;
        mainmatch_obj[otherinnings_key].bowlers_inover = 1;
        mainmatch_obj[otherinnings_key].prev_bowler = "";
      } else {
        mainmatch_obj[otherinnings_key].overscore += total_run;
      }
    }
  }
  if (isWicketDelivery) {
    if (mainmatch_obj[otherinnings_key].playersscores[bowler].wickets === 3) {
      bowlingpoints += 4;
    } else if (mainmatch_obj[otherinnings_key].playersscores[bowler].wickets === 4) {
      bowlingpoints += 8;
    } else if (mainmatch_obj[otherinnings_key].playersscores[bowler].wickets === 5) {
      bowlingpoints += 16;
    }
    if (fielders_involved !== "NA") {
      mainmatch_obj[otherinnings_key].playersscores[fielders_involved].fieldingscore +=
        fieldingpoints;
      mainmatch_obj[otherinnings_key].playersscores[fielders_involved].playerscore +=
        fieldingpoints;
      mainmatch_obj[otherinnings_key].total += fieldingpoints;
      if (kind === "caught") {
        mainmatch_obj[otherinnings_key].playersscores[fielders_involved].caughts += 1;
      }
    }
    mainmatch_obj[otherinnings_key].playersscores[bowler].playerscore += bowlingpoints;
    mainmatch_obj[otherinnings_key].total += bowlingpoints;
    mainmatch_obj[otherinnings_key].playersscores[bowler].bowlingscore += bowlingpoints;
  }
  /**Adding 2x runs for captain and 1.5 runs for vice-captain */
  let total_team_score = battingruns;

  total_team_score =
    playerobj.type === "captain"
      ? total_team_score * 2
      : playerobj.type === "vicecaptain"
      ? total_team_score * 1.5
      : total_team_score;

  mainmatch_obj[inningskey].playersscores[playerobj.Player].battingscore += battingruns;
  mainmatch_obj[inningskey].playersscores[playerobj.Player].ballsplayed.push(scoreobj);
  mainmatch_obj[inningskey].playersscores[playerobj.Player].playerscore += total_team_score;
  mainmatch_obj[inningskey].total += total_team_score;
  return mainmatch_obj;
};


/**
 * 
 * @param {array} results 
 * @returns object
 */
const display_match_results = async (results) => {
  let display_obj = { match: "CSKvRR 2022", winners: [], runners: {} };

  for (let result of results) {
    let winners_players = [];
    let runners_players = [];

    for (let player in result.Firstinnings.playersscores) {
      if (result.Firstinnings.playersscores.hasOwnProperty(player)) {
        winners_players.push({ name: player, scored: result.Firstinnings.playersscores[player].playerscore });
      }
    }

    for (let player in result.Secondinnings.playersscores) {
      if (result.Secondinnings.playersscores.hasOwnProperty(player)) {
        runners_players.push({ name: player, scored: result.Secondinnings.playersscores[player].playerscore });
      }
    }

    let winner_obj = {
      teamname: result.Firstinnings.teamname,
      score: result.Firstinnings.total,
      playersscores: winners_players
    };

    let runner_obj = {
      teamname: result.Secondinnings.teamname,
      score: result.Secondinnings.total,
      playersscores: runners_players
    };

    if (result.Firstinnings.total > result.Secondinnings.total) {
      display_obj.winners = [winner_obj];
      display_obj.runners = runner_obj;
    } else if (result.Firstinnings.total < result.Secondinnings.total) {
      display_obj.winners = [runner_obj];
      display_obj.runners = winner_obj;
    } else {
      display_obj.winners = [winner_obj, runner_obj];
      display_obj.runners = {};
    }
  }

  return display_obj;
};


module.exports = {
  add_teammembers_helper,
  checkMaxPlayersPerTeam,
  matches_score_analysis,
  display_match_results,
};
