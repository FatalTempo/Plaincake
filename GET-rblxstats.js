module.exports = async function (Name) {
    async function RetrieveData(link){let GET = await fetch(link);let TXT = await GET.text();
    console.log(TXT) // FIND WTF TOKEN 'T' IS
    console.log(TXT)
    let LOL = await JSON.parse(TXT);return LOL
    }
    let ID = await RetrieveData(`https://api.roblox.com/users/get-by-username?username=${Name}`)
    let HeadShot = await RetrieveData(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ID.Id}&size=420x420&format=Png&isCircular=true`)
    let Followers = await RetrieveData(`https://friends.roblox.com/v1/users/${ID.Id}/followers/count`)
    let Following = await RetrieveData(`https://friends.roblox.com/v1/users/${ID.Id}/followings/count`)
    let Friends = await RetrieveData(`https://friends.roblox.com/v1/users/${ID.Id}/friends/count`)
    let DisplayName = await RetrieveData(`https://friends.roblox.com/v1/metadata?targetUserId=${ID.Id}`)
    let CurrentlyWearing = await RetrieveData(`https://avatar.roblox.com/v1/users/${ID.Id}/currently-wearing`)
    let Outfits = await RetrieveData(`https://avatar.roblox.com/v1/users/${ID.Id}/outfits`)
    let OutfitName = []
    let OutfitId = []
    let WearName = []
    let WearValue = 0
    for (var i = 0; i < CurrentlyWearing.assetIds.length; i++){
        let Fetch = await RetrieveData(`https://api.roblox.com/marketplace/productinfo?assetId=${CurrentlyWearing.assetIds[i]}`)
        WearName.push(Fetch.Name)
        WearValue += Fetch.PriceInRobux
    }
    for (var i = 0; i < Outfits.data.length; i++){
        OutfitName.push(Outfits.data[i].name)
        OutfitId.push(Outfits.data[i].id)
    }

    // REMEMBER TO MAKE A WAY TO SHOW INDIVIDUAL OUTFITS VIA BUTTON MENU
    return {
        Id: ID.Id,
        HeadShot: HeadShot.data[0].imageUrl,
        Wearing: [WearName.join('\n'), WearValue],
        DisplayName: DisplayName.displayName,
        Followers: Followers.count,
        Following: Following.count,
        Friends: Friends.count
    }
}