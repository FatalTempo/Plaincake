module.exports = async function (Name, Tag, Gamemode, Region) {
    if (Gamemode === `"Deathmatch"`){return "Not Supported"}
    const FalsePromise = require(`./FalsePromise.json`)
    async function RetrieveData(link){let GET = await fetch(link);let TXT = await GET.text();let LOL = await JSON.parse(TXT);return LOL}
    const ParsedRegion = await RetrieveData(`https://api.henrikdev.xyz/valorant/v1/account/${Name}/${Tag}`) // Get region plus other stuff
    if (ParsedRegion.status === 404){
        Region = Region || "na"
    } else if (ParsedRegion.status === 200){
        Region = Region || ParsedRegion.data.region
    }
    var Elo = await RetrieveData(`https://api.henrikdev.xyz/valorant/v1/mmr/${Region.replaceAll('"', '')}/${Name}/${Tag}`)
    if (Elo.status === 404){Elo = 0}
    const Agents = {
        "Viper": 0,
        "Yoru": 0,
        "Sova": 0,
        "Fade": 0,
        "Breach": 0,
        "Sage": 0,
        "Raze": 0,
        "Omen": 0,
        "Astra": 0,
        "Chamber": 0,
        "Killjoy": 0,
        "Neon": 0,
        "Reyna": 0,
        "Skye": 0,
        "Jett": 0,
        "Phoenix": 0,
        "Cypher": 0,
        "KAY/O": 0,
        "Brimstone": 0
      }
    const Parsed = await RetrieveData(`https://api.henrikdev.xyz/valorant/v3/matches/${Region.replaceAll('"', '')}/${Name}/${Tag}?filter=${Gamemode.replaceAll('"', '')}`) // Competitive
    const Status = await Parsed.status
    let Exists = []
    if (Status === 404) { // Guard Clause for 404
        return { Status: 404 }
    } else if (Status === 200) { // Competitive is the default value
        function Algorithm(){
            let arr = []
            for (let i = 0; i < Parsed.data.length; i++){
                arr.push(Parsed.data[i]?.players.all_players.find(element => element.name === Name))
            }
            return arr
        }

        var TippingPoint = 0
        for(let i = 0; i < Algorithm().length; i++){
            if (!Algorithm()[i]){ // Round is undefined (Player didnt play round)
                TippingPoint++
                Algorithm()[i] = Object.create(FalsePromise) // json obj.
                Exists.push((i+1)+" ") // notes what round doesnt exist.
            }
        } // Check to see if the matches actually exist, otherwise create false promise.
        if (TippingPoint === 5){
            return "Bruh" // returns immediately, rest of the code below won't run
        } // Last resort if ALL the matches are undefined
        // Get Rounds played and wins
        let Rounds = 0
        let Damage_Made = 0
        let Damage_Got = 0
        let Score = 0
        let Most_Kills = []
        let RoundWins = 0
        // Isolate Individual Matches
        for(let i = 0; i < Parsed.data.length; i++){
            Rounds += Parsed.data[i].metadata.rounds_played
            Damage_Made += Parsed.data[i].players.all_players.find(element => element.name === Name).damage_made
            Damage_Got += Parsed.data[i].players.all_players.find(element => element.name === Name).damage_received
            Most_Kills.push(Parsed.data[i].players.all_players.find(element => element.name === Name).stats.kills)
            Score += Parsed.data[i].players.all_players.find(element => element.name === Name).stats.score
            RoundWins += Parsed.data[i].teams[Parsed.data[i].players.all_players.find(element => element.name === Name).team.toLowerCase()].rounds_won
        }
        // Add all unique agent playtime
        for(let i = 0; i < Algorithm().length; i++){
            if (!Algorithm()[i].session_playtime.seconds){}
            Agents[Algorithm()[i].character] += Algorithm()[i]?.session_playtime.seconds
        }
        function FindMax() { return Object.keys(Agents).find(key => parseInt(Agents[key]) === Math.max(...Object.values(Agents))) }
        let AgentArray = []
        let AgentName1 = FindMax()
        let AgentTimeFirst = (Agents[AgentName1] / 60)
        AgentArray.push(AgentName1, AgentTimeFirst)
        delete Agents[AgentName1]

        for (let i = 0; i < 3; i++){ // Doesnt push into array if they havent played the agent at all
            if (!Agents[FindMax()] / 60) { } else {
                AgentArray.push(FindMax(), (Agents[FindMax()] / 60))
                delete Agents[FindMax()]
            }
        }
        if (!Agents[FindMax()] / 60) { } else {
            AgentArray.push(FindMax(), (Agents[FindMax()] / 60))
        }
        /// Get playtime for each agent
        let Kills = 0
        let Deaths = 0
        let Assists = 0
        for (var i = 0; i < Algorithm().length; i++){Kills += Algorithm()[i].stats.kills}
        for (var i = 0; i < Algorithm().length; i++){Deaths += Algorithm()[i].stats.deaths}
        for (var i = 0; i < Algorithm().length; i++){Assists += Algorithm()[i].stats.assists}
        // Adds stats to variable

        let KD = Kills / Deaths
        let KDA = (Kills + Assists) / Deaths
        let KDPerformance = ''
        let KDAPerformance = ''
        if (!Number.isInteger(KDA)) { KDA = Number(KDA.toFixed(2))} 
        if (!Number.isInteger(KD)) { KD = Number(KD.toFixed(2))} 

        if (1 > KD) {KDPerformance = 'Below Average :arrow_down_small:'} // Below one
        else if (1 < KD) {KDPerformance = 'Above Average :arrow_up_small:'} // Above one
        else {KDPerformance = 'Average :stop_button:'} // Equal to one
        
        if (1 > KDA) {KDAPerformance = 'Below Average :arrow_down_small:'} // Same thing ^^^
        else if (1 < KDA) {KDAPerformance = 'Above Average :arrow_up_small:'}
        else {KDAPerformance = 'Average :stop_button:'}

        function SimpleMath(Variable){return Number((Variable/Rounds).toFixed(2))}
        // Get the average of something per round
        return {
            Status: Status,
            Kills: Kills,
            Deaths: Deaths,
            Assists: Assists,
            AgentArray: AgentArray,
            KD: [KD, KDPerformance],
            KDA: [KDA, KDAPerformance],
            Rank: `${Algorithm()[0].currenttier_patched}`,
            Exists: Exists.join(', '),
            // AccountLVL: ParsedRegion.data.account_level,
            DamageRound: SimpleMath(Damage_Made) + " <:DamageRound:1023731431601623061>",
            ReceivedRound: SimpleMath(Damage_Got) + " <:ReceivedRound:1023731421208133682>",
            KillsRound: SimpleMath(Kills) + " <:KillsRound:1023734693335662633>",
            Most_Kills: Math.max(...Most_Kills) + " <:MostKills:1023732832419450982>",
            ScoreRound: SimpleMath(Score) + " <:ScoreRound:1023751378067259462>",
            RoundWinPercentage: SimpleMath(RoundWins) + "%",
            Elo: await Elo.data.elo
        }
        // Profile.AgentArray[0] = First Agent Name
        // Profile.AgentArray[1] = Playtime for Agent [Max/First] (In Minutes)
        // Profile.AgentArray[2] = Second Agent Name
        // Profile.AgentArray[3] = Playtime for Agent [2nd/Second]
        // Profile.AgentArray[4] = Third Agent Name
        // Profile.AgentArray[5] = Playtime for Agent [3rd/Third]
        // Profile.AgentArray[6] = Fourth Agent Name
        // Profile.AgentArray[7] = Playtime for Agent [4th/Fourth]
        // Profile.AgentArray[8] = Fifth Agent Name
        // Profile.AgentArray[9] = Playtime for Agent [Min/Fifth]
    } else {
        return { Status: Status } // If there is no 404 or 200 then return the status code it gives.
    }
}