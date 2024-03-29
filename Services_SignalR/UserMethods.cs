﻿using FollowMe2.Models;
using FollowMe2.Services;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using MongoDB.Driver.Builders;

namespace FollowMe2.Services_SignalR
{
    public class UserMethods : Hub
    {
        MultiplayerServices multi = new MultiplayerServices();
        Deployment deploy = new Deployment();
        PlayerServices playerServices = new PlayerServices();
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public void updateAccessTime(string action, string username)
        {
            var db = deploy.getDB();
            var users = db.GetCollection<userDefined>("userDefined");
            userDefined userToUpdate = users.FindOne(Query.EQ("username", username));
            switch (action)
            {
                case "newAccess":
                    userToUpdate.lastActive = DateTime.Now;
                    break;
                case "exit":
                    userToUpdate.lastLoggedOut = DateTime.Now;
                    break;
            }
            users.Save(userToUpdate);
        }

        public void quitUser(string username)
        {
            username = playerServices.changeStringDots(username, false);
            updateAccessTime("exit", username);
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            var users = db.GetCollection<userDefined>("userDefined");
            var resetUserCheckpoint = users.FindOne(Query.EQ("username", username));
            resetUserCheckpoint.checkpoint = 0;
            users.Save(resetUserCheckpoint);

            var loginLog = db.GetCollection("loginLog");
            loginLog.Remove(Query.EQ(username, 1));

            Clients.All.SendAsync("userQuitting",username);
        }
        public async Task getWeapons(string username)
        {
            Deployment deploy = new Deployment();
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            //using (mongo.RequestStart(db))
            //{
            var collection = db.GetCollection<weapon>("weapons");
            var result = collection.FindAll();
            foreach (var item in result)
            {
                await Clients.All.SendAsync("getWeapons", username, item);
            }
        }
        public async Task getWeapon(string username, bool online, bool community)
        {
            var username2 = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            //using (mongo.RequestStart(db))
            //{
            var collection = db.GetCollection<userDefined>("userDefined");
            var theUser = collection.FindOne(Query.EQ("username", username2));
            if (theUser != null)
            {
                int weaponID = theUser.weaponID;
                var weaponDefinition = db.GetCollection<weapon>("weapons");
                var theirWeapon = weaponDefinition.FindOne(Query.EQ("identifierToSee", weaponID));
                if (theUser.personType != "3")
                {
                    await Clients.All.SendAsync("getWeapon", username, theirWeapon, online, community);
                }
            }
        }
        public string manipulateName(string existingName, string newname, string method, string username)
        {
            username = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            var collection = db.GetCollection("stuff");
            var usertoupdate = collection.FindOne(Query.EQ("name", existingName));
            switch (method)
            {
                case "update":
                    usertoupdate["name"] = newname;
                    collection.Save(usertoupdate);
                    Clients.All.SendAsync("userMethods", existingName, newname);
                    break;
                case "delete":
                    collection.Remove(Query.EQ("name", existingName));
                    Clients.All.SendAsync("userMethods", existingName, newname, method);
                    break;
                case "insert":
                    var nameInserted = new QueryDocument("name", existingName);
                    nameInserted["title"] = "plumber";
                    collection.Insert(nameInserted);
                    collection.Save(nameInserted);
                    Clients.All.SendAsync("userMethods", existingName, method);
                    break;
                default:
                    Clients.All.SendAsync("userMethods", existingName, "Unknown");
                    break;
            }
            return method;
        }
        public void getUserStats(bool leader, string username, string levelName)
        {
            Deployment deploy = new Deployment();
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            var person = db.GetCollection<userDefined>("userDefined");
            var statsForRank = db.GetCollection<statsForRank>("statsToRank");
            var statsForXpAll = db.GetCollection<statsForXP>("xpStats");
            var statsUserLog = db.GetCollection<xpStatsUserLog>("xpStatsUserLog");
            var xptoRankAll = db.GetCollection<xpToRank>("xpToRank");

            var username2 = playerServices.changeStringDots(username, false);
            if (username != null)
            {
                var showPrizes = true;
                var userToQuery = person.FindOne(Query.EQ("username", username2));
                var statsToQuery = statsForRank.FindOne(Query.EQ("rank", userToQuery.rank));
                var statsXPlist = new List<statsForXP>();
                foreach (var item in statsForXpAll.FindAll().ToList())
                {
                    if (item.action == "allPrizes")//List of those conditional items, change to switch
                    {
                        if (levelName != "" && statsToQuery != null)
                        {
                            item.numberToDo = getTypeOfObjectForLevel(db, levelName, "EndingTheBeginning", "bonuses");  //As of 1.12.5 there is no concept of worlds yet [would need regions too]                   
                        }
                        showPrizes = false;
                    }

                    foreach (var userLog in statsUserLog.Find(Query.EQ("username", username2)).ToList())
                    {
                        if (userLog.actionType == item.action + item.type && userLog.isBlocker)
                        {
                            if (item.oncePerLevel && userLog.nonSpecialDefinition == levelName || item.special)
                            {
                                item.type = "done";
                            }
                            //else {
                            //    item.type = item.type;
                            //}                                                     
                        }
                        if (/*(item.oncePerLevel == false) ||*/ (userLog.actionType == "prizefind" || userLog.actionType == "allPrizesFind") && showPrizes == false && item.type == "find" && userLog.numberDone >= item.numberToDo)
                        {
                            item.type = "done";
                        }
                    }
                    statsXPlist.Add(item);
                }

                var xpToRankForPlayer = xptoRankAll.FindOne(Query.EQ("rank", userToQuery.rank));
                if (userToQuery != null)
                {
                    long howManyNotifications = db.GetCollection("notifications").Find(Query.And(
                        Query.EQ("to", username2),
                        Query.EQ("read", false))).Count();

                    Clients.All.SendAsync("displaydesign",leader, userToQuery.head, userToQuery.chest, userToQuery.legs, userToQuery, username, statsToQuery, xpToRankForPlayer.maxXP, howManyNotifications);
                    Clients.All.SendAsync("getXPAllocationArray",username, statsXPlist);
                    //Should be statsToRank
                }
            }
        }
        public void updateHealth(string username, int newhealth, int oldHealth, bool dying, int maxLives)
        {
            username = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var levelListing = db.GetCollection<levelList>("levelList");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            var levelToQuery = levelListing.FindOneAs<levelList>(Query.And(
                Query.EQ("worldNumber", userToQuery.world),
                Query.EQ("identifier", userToQuery.level)
                ));
            //var levelToQuery = levelList.FindOne(Query.EQ("_id", userToQuery.world));
            string levelName = levelToQuery.fullName.ToString();
            var queryingString = levelName + "Imagessurface";
            var startpoint = db.GetCollection<image>(queryingString);
            var startpoint2 = startpoint.FindOne(Query.EQ("startpoint", true));
            if (dying)
            {
                userToQuery.lives = userToQuery.lives - 1;
                if (userToQuery.lives <= 0)
                {
                    userToQuery.lives = maxLives;
                }
                userToQuery.health = oldHealth;
                Clients.All.SendAsync("updateMemberLives",userToQuery, startpoint2, username);
                //All back calls need to be removed
            }
            userToQuery.health = newhealth;
            person.Save(userToQuery);
        }
        public void gameOver(string username, int lifeCount, int maxHealth)
        {
            username = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            userToQuery.lives = lifeCount;
            userToQuery.checkpoint = 0;
            userToQuery.health = maxHealth;
            person.Save(userToQuery);
        }
        public void updateXPorLevel(string username, int xp)
        {
            username = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            var xptoRankAll = db.GetCollection<xpToRank>("xpToRank");
            var xpToRankDefined = xptoRankAll.FindOne(Query.EQ("rank", userToQuery.rank));
            var statsForRankAll = db.GetCollection<statsForRank>("statsToRank");
            var statsToQuery = statsForRankAll.FindOne(Query.EQ("rank", userToQuery.rank + 1));
            if (xpToRankDefined.maxXP <= xp)
            {
                userToQuery.rank += 1;
                userToQuery.health = statsToQuery.health;
                userToQuery.maxHealth = statsToQuery.health;
            }



            userToQuery.XP = xp;
            person.Save(userToQuery);
            var xpNextRank = xptoRankAll.FindOne(Query.EQ("rank", userToQuery.rank));
            Clients.All.SendAsync("playerNewXPAndRank", playerServices.changeStringDots(username, true), userToQuery.XP, userToQuery.rank, xpNextRank.maxXP, statsToQuery);
        }
        public void updateXPLogForUser(string username, string XPStatsAction, string XPStatsType, string levelName)
        {
            username = playerServices.changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            var statsForXPAll = db.GetCollection<statsForXP>("xpStats");
            var statToLog = statsForXPAll.FindOne(Query.And(Query.EQ("type", XPStatsType), Query.EQ("action", XPStatsAction)));
            var personStatToAdd = db.GetCollection<xpStatsUserLog>("xpStatsUserLog");
            var userLogForXP = personStatToAdd.FindOne(Query.And(Query.EQ("actionType", XPStatsAction + XPStatsType), Query.EQ("username", username)));

            if (statToLog.oncePerLevel && (userLogForXP == null || userLogForXP.nonSpecialDefinition != levelName))
            {
                userLogForXP = null;// for now until world names, 
            }

            bool isBlocking = false;
            if (statToLog.special || statToLog.oncePerLevel)
            {
                isBlocking = true;
            }
            var insertThisLog = new xpStatsUserLog
            {
                username = username,
                actionType = XPStatsAction + XPStatsType,
                forSpecial = statToLog.type,
                isBlocker = isBlocking,
                nonSpecialDefinition = levelName,
                numberDone = statToLog.numberToDo
            };

            if (userLogForXP == null)
            {
                personStatToAdd.Insert(insertThisLog);
                personStatToAdd.Save(insertThisLog);
            }
            else
            {
                userLogForXP.numberDone += 1;
                personStatToAdd.Save(userLogForXP);
            }
        }
        
        public int getTypeOfObjectForLevel(MongoDatabase db, string levelName, string worldName, string objectType)//as of 1.12.4 no "worlds"
        {
            int returnThis = 0;
            levelList levelDefinition = db.GetCollection<levelList>("levelList").FindOne(Query.And(Query.EQ("fullName", levelName), Query.EQ("worldName", worldName)));
            playerProgressInLevel playerProg = db.GetCollection<playerProgressInLevel>("playerProgressInLevel").FindOne(Query.And(Query.EQ("levelIdentifier", levelName), Query.EQ("worldName", worldName)));

            if (playerProg != null && levelDefinition != null)//stop non game levels getting here
            {
                switch (objectType)
                {
                    case "allies":
                        returnThis = levelDefinition.alliesToSave - playerProg.alliesSaved;
                        break;
                    case "bonuses":
                        returnThis = levelDefinition.bonusesIncluded - playerProg.bonusesFound;
                        break;
                    case "checkpoints":
                        returnThis = levelDefinition.checkpointsToCross - playerProg.checkpointsCrossed;
                        break;
                    case "caves":
                        returnThis = levelDefinition.cavesToOpen - playerProg.cavesOpened;
                        break;
                }
            }
            return returnThis;

        }
    }
}