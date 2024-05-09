/**
 * 
 * @param {array} players 
 * @param {object} captain 
 * @param {object} vicecaptain 
 * @returns captain_obj,vicecaptain_obj,players_obj
 */
const add_teammembers_helper = async(players,captain,vicecaptain)=>{
    const { Player: captainPlayer, Role: captainRole, Team: captainTeam } = captain;
    const { Player: viceCaptainPlayer, Role: viceCaptainRole, Team: viceCaptainTeam } = vicecaptain;

    const captainObj = players.find(obj => obj.Player === captainPlayer && obj.Role === captainRole && obj.Team === captainTeam);
    const viceCaptainObj = players.find(obj => obj.Player === viceCaptainPlayer && obj.Role === viceCaptainRole && obj.Team === viceCaptainTeam);

    const updatedPlayers = players.filter(obj => obj !== captainObj && obj !== viceCaptainObj);
    const playerIds = updatedPlayers.map(item => item._id);

    return { captainObj, viceCaptainObj, playersObj: playerIds };
}
/**
 * 
 * @param {array} players 
 * @returns integer
 */
function checkMaxPlayersPerTeam(players) {
    // Object to store counts of players per team
    const teamCounts = {};

    // Count players for each team
    players.forEach(player => {
        const team = player.Team;
        teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    // Check if any team has more than 10 players
    const exceededTeams = Object.keys(teamCounts).filter(team => teamCounts[team] > 10);

   return exceededTeams;
}

module.exports ={
    add_teammembers_helper,
    checkMaxPlayersPerTeam
}