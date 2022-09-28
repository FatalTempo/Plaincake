const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');
const prefix = ';';
const HTTPS = require(`./HTTPStatus.json`)
const AgentInfo = require(`./AgentInfo.json`)
const DataFetching = require("./DataFetching.js")
const RankIcon = require(`./RankIcon.json`)
const client = new Discord.Client({
    allowedMentions: {
        parse: ['users', 'roles'], repliedUser: true,
    },
    intents: [
        "GUILDS",
        "GUILD_MESSAGES", 
        "GUILD_MESSAGE_TYPING", 
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_BANS",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_PRESENCES",
        "GUILD_SCHEDULED_EVENTS",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS"
    ],
});

client.once('ready', () => {
    client.user.setActivity('Pancakes Fry...', {type: 'WATCHING'});
    client.user.setStatus("online");
    console.log('Pouring Syrup...\n');
    
    let commands = client.application?.commands
    
    commands.create({
      name: "valstats",
      description: "Returns the given user's statistics. Ex) rank, mmr, whatever.",
      options: [
        {
          type: 'STRING',
          name: "name",
          description: "(REQUIRED) Riot Username",
          required: true
        },
        {
          type: 'STRING',
          name: "tag",
          description: "(REQUIRED) Riot Tag",
          required: true
        },
        {
          type: 'STRING',
          name: "gamemode",
          description: "Returns specific stuff for specific gamemodes. (Shows Competitive by Default)",
          choices: [
            {
              name: "Competitive",
              value: "\"Competitive\""
            },
            {
              name: "Unrated",
              value: "\"Unrated\""
            },
            {
              name: "Deathmatch",
              value: "\"Deathmatch\""
            },
            {
              name: "Spike Rush",
              value: "\"spikerush\""
            }
          ]
        },
        {
          type: 'STRING',
          name: "region",
          description: "Please try some other region if you dont see your player data. (Set to NA by Default)",
          choices: [
            {
              name: "NA",
              value: "\"na\""
            },
            {
              name: "EU",
              value: "\"eu\""
            },
            {
              name: "AP",
              value: "\"ap\""
            },
            {
              name: "KR",
              value: "\"kr\""
            }
          ]
        }
      ]
    }
  )
});

/*
// command handler
client.on('messageCreate', message => {
  
  // console.log(message.author.bot) checks if you is a bot
  console.log(message.author.accentColor) // undefined
  console.log(message.author.avatar) // 3583e47eb08df18f5503d768b50c62a5 ????
  console.log(message.author.banner) // undefined
  console.log(message.author.client) // This is an object
  // console.log(message.author.createdAt) Gives date (Sat Aug 29 2020 20:05:48 GMT-0700 (Pacific Daylight Time))
  // console.log(message.author.createdTimestamp) Unix Epoch String 1598756748027
  console.log(message.author.defaultAvatarURL) // Literally default skin
  // console.log(message.author.discriminator) Gives tag number of user (1994)
  console.log(message.author.dmChannel) // null I think its a DM
  console.log(message.author.hexAccentColor) // undefined
  // console.log(message.author.id) unique uuid
  // console.log(message.author.partial) 
  // console.log(message.author.system)
  // console.log(message.author.tag) NiceStory#1994
  // console.log(message.author.username) NiceStory
  
  if (message.content.startsWith(prefix)){
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(command + " Cmd & Arg " + args)
    
    //client.on('message', msg =>{
    if (command === 'follow'){
      if (args.length === 0 || args.includes("-help")){ // checks if oFollow is an array length of 1 [cuz no parameters duh]
        var today = new Date();
        var d = today.toLocaleDateString();
        var t = today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        if(t.charAt(0) === '0') {t = t.slice(1, 8);} // created by me

          const serverEmbed = new Discord.MessageEmbed()
          // setting to the line above
          .setColor('#EC931C')
          .setTitle('o | Follow Usage & Parameters')
          .setDescription('Showing "**oFollow**" Help Menu')
          .addFields(
            { name: '**Formating**', value: 'oFollow <args>', inline: true},
            { name: '**Parameters**', value: '-help\n-n\nSpotify Link', inline: true },
            { name: '**Parameter Info**', value: '-help: Displays this help menu\n-n: Sends the newest video\nSpotify Link: A required parameter if you want to be updated on the latest video (insert link there!)', inline: false },
            { name: 'Testy', value: '\u200B', inline: false},
          )
          .setFooter({ text: d + ' ' + t , iconURL: 'https://i.imgur.com/vO2AkUv.png' });
          
          message.channel.send({embeds:[serverEmbed]});

          return null; // To avoid sending anything after this scope
        } else if (args.length > 0){
          return message.channel.send("Those Arguments Doesn't Exist");
        }
        
        

        // At the very end check to see if they added arguments that doesn't exist. Return if true
        message.channel.send('a');
      }
      //          THIS IS THE END OF THE COMMAND "follow"

      if (command === "valstats"){
        return
      }

      if (command === "vandels"){
        return
      }
      //});
      //
      //
      if (command === 'test'){
        message.channel.send('a');
      }
      //
      //
    }
  }
);
*/

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()){return;}

  const { commandName, options } = interaction

  if (commandName === "valstats") {
    var Name = options.getString('name')
    var Tag = options.getString('tag')
    var Region = options.getString('region');Region = Region || 'na'
    var Gamemode = options.getString('gamemode');Gamemode = Gamemode || 'Competitive'
    await interaction.deferReply(); // DEFER REPLY FOR THAT API
    const Profile = await DataFetching(Name, Tag, Gamemode, Region);
    let BasicEmbed = new Discord.MessageEmbed().setColor('#EC931C')
    if (Profile === "Not Supported"){
      let Deathmatch = BasicEmbed
        .setTitle("This option is currently not supported")
        .setDescription("Give me time. thank you")
      interaction.editReply({ephemeral: true,embeds: [Deathmatch]})
      return
    } else if (Profile.Status === 404){
      const FailedEmbed = BasicEmbed
        .setTitle("(ERROR 404): Profile Does Not Exist")
        .setDescription("Please Check Your Spelling For Any Mistakes.")
      interaction.editReply({ephemeral: true,embeds: [FailedEmbed]})
      return
    } else if (Profile === "Bruh") {
      interaction.editReply({ephemeral: true,embeds: [BasicEmbed.setTitle(`Homeboy ${Name} has never played comp.`)]})
      return
    } else if (Profile.Status === 408) {
      const ClosedEmbed = BasicEmbed
        .setTitle("(ERROR 408): API Server Closed Connection")
        .setDescription("⠀⠀⠀⠀⠀⠀⠀⠀Please Try Again Shortly.")
      interaction.editReply({ephemeral: true,embeds: [ClosedEmbed]})
      return
    } else if (Profile.Status === 403) {
      const ClosedEmbed = BasicEmbed
        .setTitle("(ERROR 403): Riot Origin Server down for maintenance")
        .setDescription("⠀⠀⠀⠀⠀⠀⠀⠀Please Try Again Shortly.")
      interaction.editReply({ephemeral: true,embeds: [ClosedEmbed]})
      return
    } else if (Profile.Status === 200) { // Sets Each Agent slot to nothing if the value is undefined
      if (!Profile.AgentArray[2]){ // 2nd
        var Second = ''
      } else {var Second = `\n**⠀${Profile.AgentArray[2]}: ${Profile.AgentArray[3]}m**`}
      if (!Profile.AgentArray[4]){ // 3rd
        var Third = ''
      } else {var Third = `\n**⠀${Profile.AgentArray[4]}: ${Profile.AgentArray[5]}m**`}
      if (!Profile.AgentArray[6]){ // 4th
        var Fourth = ''
      } else {var Fourth = `\n**⠀${Profile.AgentArray[6]}: ${Profile.AgentArray[7]}m**`}
      if (!Profile.AgentArray[8]){ // 5th
        var Fifth = ''
      } else {var Fifth = `\n**⠀${Profile.AgentArray[8]}: ${Profile.AgentArray[9]}m**`}
      if (!Profile.Exists.length){}else{
        Profile.Exists = `\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀__WARNING:__\nMatchs ${Profile.Exists}does not exist. Results WILL be inaccurate.**`
      }
      if (Gamemode === `"spikerush"`){Gamemode = "Spike Rush"}
      const ServerEmbed = new Discord.MessageEmbed()
      .setColor(`${AgentInfo[Profile.AgentArray[0]].Color}`)
      .setTitle(`Showing ${Gamemode.replaceAll('"', '')} Stats For ${Name}`) // Screw spike rush
      .setDescription(`*Showing the 5 most recent competitive matches*`)
      .setThumbnail(`${AgentInfo[Profile.AgentArray[0]].Icon}`)
      .addFields(
        { name: '** ⠀Kills⠀/⠀Deaths⠀/⠀Assists**', value: `⠀:crossed_swords: **${Profile.Kills}**⠀⠀:skull: **${Profile.Deaths}**⠀⠀⠀ :handshake: **${Profile.Assists}**\n\n** ⠀Rank:⠀${Profile.Rank} ${RankIcon[Profile.Rank].Emoji}**\n** ⠀KD Ratio:⠀${Profile.KD[0]}⠀(${Profile.KD[1]})**\n** ⠀KDA Ratio:⠀${Profile.KDA[0]}⠀(${Profile.KDA[1]})**`, inline: true},
        { name: '**Most Played\n⠀⠀__Agents__**', value: `**⠀${Profile.AgentArray[0]}: ${Profile.AgentArray[1]}m**${Second}${Third}${Fourth}${Fifth}`, inline: true },
        { name: `**⠀⠀⠀⠀⠀⠀⠀__ROUND BY ROUND ANALYSIS__**`, value: '⠀⠀⠀**Showing the average performance per round**', inline: false },
        { name: `**⠀__Damage/Round:__⠀__Received/Round:__⠀__Kills/Round:__**`, value: `**⠀⠀⠀⠀${Profile.DamageRound}⠀⠀ ⠀⠀${Profile.ReceivedRound}⠀⠀⠀⠀⠀${Profile.KillsRound}**`, inline: false },
        { name: `**⠀__Score/Round:__⠀__Most Kills (Match):__⠀__Round%:__**`, value: `⠀ ⠀**${Profile.ScoreRound}⠀⠀⠀⠀⠀⠀${Profile.Most_Kills}⠀⠀⠀⠀⠀⠀⠀${Profile.RoundWinPercentage}**`, inline: false},
        { name: ` ⠀${Profile.Exists}`, value: '\u200B', inline: false},
      )
      .setFooter({ text: `Elo: ${Profile.Elo}` , iconURL: `${RankIcon[Profile.Rank].Img}` });
      
      await interaction.editReply({
        ephemeral: false,
        embeds: [ServerEmbed],
        components: [
          {
            "type": 1,
            "components": [
              {
                "style": 5,
                "label": `${Profile.AgentArray[0]} Lineups`,
                "url": `https://tracker.gg/valorant/guides/clips?agent=${Profile.AgentArray[0].toLowerCase()}`,
                "disabled": false,
                "emoji": {
                  "id": `${AgentInfo[Profile.AgentArray[0]].Emoji}`,
                  "name": `${Profile.AgentArray[0]}`,
                  "animated": false
                },
                "type": 2
              }
            ]
          }
        ]
      })
      return
    } else {
      const UnknownErrorEmbed = BasicEmbed
      .setTitle(`(ERROR ${Profile.Status}): ${HTTPS[Profile.Status]}`)
      .setDescription(`Report this error to me asap, NiceStory#1994`)
      interaction.editReply({ ephemeral: true , embeds: [UnknownErrorEmbed] })
      return
    }
  }
})

/*
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function(data) {
      console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
*/
client.login(HTTPS[999]);