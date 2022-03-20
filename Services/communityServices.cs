using FollowMe2.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver.Builders;
using MongoDB.Driver;

namespace FollowMe2.Services
{

    public class communityServices : Hub
    {
        public deployment deploy = new deployment();
        public userMethods user = new userMethods();

        public List<string> getMyLevels(string username, bool onlyDone)
        {
            var db = deploy.getDB();
            List<string> levelsDone = new List<string>();

            levelsDone.Add("Select a level");

            List<levelAccess> potentialLevels = db.GetCollection("levelAccess").FindAs<levelAccess>(Query.EQ("username", username)).ToList();
            foreach (var item in potentialLevels)
            {
                bool continuing = false;
                string fullName = db.GetCollection("levelList").FindOneAs<levelList>(Query.EQ("identifier", item.level)).fullName;
                if (onlyDone == false)
                {
                    continuing = true;
                }
                else
                {
                    if (targetProgressCount(username, false, item.level, 1, "all") == targetProgressCount(username, true, item.level, 1, "all"))
                    {
                        continuing = true;
                    }
                }
                if (continuing)
                {
                    levelsDone.Add(fullName);
                }

            }
            return levelsDone;
        }
        public void deleteOnlinePresence(string username, string helpRequest)
        {
            Clients.All.SendAsync("thisPlayerPresenceRemoved",username, helpRequest);
        }

        public void sharePartnerEnemyHurt(string sourceName, string name1, string name2, int hurt, string helpRequest, string enemyID)
        {
            string nameForClient = name1;
            if (sourceName == name1)
            {
                nameForClient = name2;
            }
            Clients.All.SendAsync("hurtPartnerEnemy",nameForClient, helpRequest, hurt, enemyID);
        }

        public void shareCheckpoint(string sourceName, string name1, string name2, int checkpoint, string helpRequest)
        {
            string nameForClient = name1;
            if (sourceName == name1)
            {
                nameForClient = name2;
            }
            Clients.All.SendAsync("givePartnerCheckpoint",nameForClient, helpRequest, checkpoint);
        }

        public void checkLevelAttendanceForHelp(string levelName, string forWho, bool forHelper)
        {
            var db = deploy.getDB();
            var helpRequestsForLevel = db.GetCollection<helpRequest>("helpRequests").Find(Query.And(
                Query.EQ("from", forWho), Query.EQ("level", levelName), Query.EQ("confirmed", true)));
            foreach (var item in helpRequestsForLevel)
            {
                if (forHelper)
                {
                    addNotificationToPlayer(item.to, forWho, "helpAttending", item.level, "");
                }
                else
                {
                    addNotificationToPlayer(forWho, item.to, "helpConfirmation", item.level, "");
                }

            }
        }

        public void readNotification(string from, string to, string type, string additionalIdentifier)
        {
            var db = deploy.getDB();
            var notifications = db.GetCollection("notifications");
            notification notificationToRead = notifications.FindOneAs<notification>(Query.And(
            Query.EQ("to", to), Query.EQ("from", from), Query.EQ("type", type)));

            if (additionalIdentifier != null && additionalIdentifier.Length > 0)
            {
                notificationToRead = notifications.FindOneAs<notification>(Query.And(
            Query.EQ("to", to), Query.EQ("from", from), Query.EQ("type", type), Query.EQ("content", additionalIdentifier)));
            }

            notificationToRead.read = true;
            notifications.Save(notificationToRead);
            if (type == "newMessage")
            {
                notifications.Remove(Query.And(
                Query.EQ("to", to), Query.EQ("from", from), Query.EQ("type", type)));
            }
        }

        public void confirmHelp(string from, string to, string forLevel)
        {
            var db = deploy.getDB();
            var confirmHelpRequest = db.GetCollection("helpRequests");
            helpRequest confirmThis = confirmHelpRequest.FindOneAs<helpRequest>(Query.And(Query.EQ("to", to), Query.EQ("from", from), Query.EQ("level", forLevel)));
            confirmThis.confirmed = true;
            confirmHelpRequest.Save(confirmThis);
        }
        public void editFriendRequest(string from, string to, string type, bool confirmed)
        {
            var db = deploy.getDB();
            var notifications = db.GetCollection("notifications");
            var friendRequests = db.GetCollection("addRequests");
            readNotification(from, to, type, "");

            addRequest pendingFriendRequest = friendRequests.FindOneAs<addRequest>(Query.And(
                Query.EQ("to", to),
                Query.EQ("from", from)));

            if (confirmed)
            {
                friendRequests.Insert(new addRequest
                {
                    approved = true,
                    from = to,
                    to = from,
                });

                pendingFriendRequest.approved = true;

                friendRequests.Save(pendingFriendRequest);
            }
            else
            {
                friendRequests.Remove(Query.And(Query.EQ("from", pendingFriendRequest.to), Query.EQ("to", pendingFriendRequest.from)));
                friendRequests.Remove(Query.And(Query.EQ("to", pendingFriendRequest.to), Query.EQ("from", pendingFriendRequest.from)));
                notifications.Remove(Query.And(Query.EQ("to", pendingFriendRequest.to), Query.EQ("from", pendingFriendRequest.from)));
            }

        }

        public void sendMessageToUser(string from, string message, string to)
        {
            var db = deploy.getDB();
            var messages = db.GetCollection("playerMessages");
            messages.Insert(new playerMessages
            {
                from = from,
                message = message,
                to = to,
                when = DateTime.Now
            });
            addNotificationToPlayer(to, from, "newMessage", message, "");
        }

        public int getFriendStatus(string forWho, string to)
        {
            var returnThis = 2;//They have a friend in you
            var db = deploy.getDB();
            var addRequest = db.GetCollection<addRequest>("addRequests").FindOneAs<addRequest>(Query.And(
                Query.EQ("to", to),
                Query.EQ("from", forWho)
                ));
            if (addRequest == null)
            {
                returnThis = 0;//no request sent.
            }
            else
            {
                if (addRequest.approved == false)
                {
                    returnThis = 1;//request not heard | ignored
                }
            }

            return returnThis;


        }

        public void addNotificationToPlayer(string to, string from, string type, string additionalDetail, string additional2)
        {
            //var hubContext = GlobalHost.ConnectionManager.GetHubContext<communityServices>();
            var db = deploy.getDB();
            var notifications = db.GetCollection<notification>("notifications");
            var addRequests = db.GetCollection<addRequest>("addRequests");
            var helpRequests = db.GetCollection<addRequest>("helpRequests");
            var fromPlayer = db.GetCollection<userDefined>("userDefined").FindOne(Query.EQ("username", from));
            int rank = fromPlayer.rank;
            int difficulty = fromPlayer.difficulty;
            var continuing = true;

            if (notifications.Find(Query.And(Query.EQ("to", to), Query.EQ("from", from), Query.EQ("type", type), Query.EQ("read", false))).Count() > 0)
            {
                continuing = false;
            }

            string contentFromType = "";
            switch (type)
            {
                case "add":
                    contentFromType = "A new user has requested to connect: " + from;

                    if (addRequests.Find(Query.And(Query.EQ("to", to), Query.EQ("from", from))).Count() > 0)
                    {
                        continuing = false;
                    }
                    else
                    {
                        addRequests.Insert(new addRequest
                        {
                            to = to,
                            from = from,
                            approved = false
                        });
                    }
                    break;
                case "remove":
                    contentFromType = "You have been removed by this user: " + from;
                    addRequests.Remove(Query.And(Query.EQ("to", to), Query.EQ("from", from)));
                    break;
                case "confirm":
                    contentFromType = "You have been confirmed as a friend by: " + from;
                    break;
                case "newMessage":
                    contentFromType = "New message from your friend: " + from;
                    Clients.All.SendAsync("showNotificationCount",1, to, type);//Notify them even if they didn't read the last message
                    Clients.All.SendAsync("showOtherPlayerMessage",to, from, additionalDetail);
                    break;
                case "help":
                    contentFromType = "Your friend: " + from + " has asked for help in the level: " + additionalDetail;
                    Clients.All.SendAsync("showNotifiicationCount",1, to, type);
                    if (helpRequests.Find(Query.And(Query.EQ("to", to), Query.EQ("from", from), Query.EQ("level", additionalDetail))).Count() > 0)
                    {
                        continuing = false;
                    }
                    else
                    {
                        helpRequests.Insert(new helpRequest
                        {
                            to = to,
                            from = from,
                            difficulty = difficulty,
                            done = false,
                            level = additionalDetail,
                            world = "EndingTheBeginning",
                            confirmed = false
                        });
                    }
                    break;
                case "removeHelp":
                    contentFromType = "Your help request to " + from + " has been removed";
                    addRequests.Remove(Query.And(Query.EQ("to", to), Query.EQ("from", from)));
                    break;
                case "helpAgreed":
                    contentFromType = "Help request to " + from + " is agreed, when in " + additionalDetail + ", they'll know";
                    break;
                case "helpAttending":
                    contentFromType = "You said you'd help '" + from + "' in '" + additionalDetail + "', click to go now!";
                    break;
                case "helpConfirmation":
                    contentFromType = from + " said they'd help in " + additionalDetail + ", click to enjoy!";
                    break;
                case "newChallenge":
                    contentFromType = from + " has made a new competition in " + additionalDetail + ", the theme: " + additional2 + "!";
                    break;
            }
            if (continuing)
            {
                notification insertThis = new notification
                {
                    to = to,
                    from = from,
                    content = contentFromType,
                    type = type,
                    when = DateTime.Now,
                    rank = rank
                };
                if (type != "newMessage")
                {
                    Clients.All.SendAsync("showNotificationCount",1, to, type, contentFromType);
                }
                if (type == "helpAttending" || type == "helpConfirmation")
                {
                    insertThis.read = true;
                }
                notifications.Insert(insertThis);
            }
        }

        public void addPlayerProgress(string username, string levelName, string worldName)
        {
            username = user.changeStringDots(username, true);

            var db = deploy.getDB();
            var progressDefinition = db.GetCollection<playerProgressInLevel>("playerProgressInLevel");
            long hasTheUserBeenHereBefore = progressDefinition.Find(Query.And(
                Query.EQ("username", username),
                Query.EQ("levelIdentifier", levelName),
                Query.EQ("worldName", worldName)
                )).Count();
            if (hasTheUserBeenHereBefore < 1)//So there isn't already an in progress entry for that person
            {
                progressDefinition.Insert(new playerProgressInLevel
                {
                    bonusesFound = 0,
                    cavesOpened = 0,
                    checkpointsCrossed = 0,
                    alliesSaved = 0,
                    levelIdentifier = levelName,
                    username = username,
                    quickestSecondsToFinish = 0,
                    worldName = worldName
                });
            }
        }

        public void setFastestLevelTime(string username, string levelName, float timeToFinish)
        {
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var progressDefinition = db.GetCollection<playerProgressInLevel>("playerProgressInLevel");
            var levelProgressToUpdate = progressDefinition.FindOne(Query.And(
                Query.EQ("username", user.changeStringDots(username, true)),
                Query.EQ("levelIdentifier", levelName)
                ));
            if (levelProgressToUpdate.quickestSecondsToFinish == 0 ||
                levelProgressToUpdate.quickestSecondsToFinish < timeToFinish)
            {
                levelProgressToUpdate.quickestSecondsToFinish = timeToFinish;
                progressDefinition.Save(levelProgressToUpdate);
            }
        }

        public int targetProgressCount(string username, bool forLevel, string levelIdent, int worldNumber, string objectType)
        {
            int valueToReturn = 0;
            deployment deploy = new deployment();
            var db = deploy.getDB();
            if (forLevel == false)
            {
                var level = db.GetCollection<levelList>("levelList").FindOne(Query.EQ("identifier", levelIdent));

                var progressLog = db.GetCollection<playerProgressInLevel>("playerProgressInLevel").FindOneAs<playerProgressInLevel>(Query.And(
                    Query.EQ("username", user.changeStringDots(username, true)),
                    Query.EQ("levelIdentifier", level.fullName)
                    //Nothing is outside of worlds
                    ));
                if (progressLog != null)
                {
                    switch (objectType)
                    {
                        case "checkpoint":
                            valueToReturn = progressLog.checkpointsCrossed;
                            break;
                        case "bonus":
                            valueToReturn = progressLog.bonusesFound;
                            break;
                        case "ally":
                            valueToReturn = progressLog.alliesSaved;
                            break;
                        case "cave":
                            valueToReturn = progressLog.cavesOpened;
                            break;
                        default:
                            valueToReturn = progressLog.cavesOpened +
                                progressLog.bonusesFound +
                                //Commented due to "saving" not being possible, thus 100% not possible//progressLog.alliesSaved +
                                progressLog.checkpointsCrossed;
                            break;
                    }
                }
            }
            else
            {
                var progressLog = db.GetCollection<levelList>("levelList").FindOneAs<levelList>(Query.And(
                    Query.EQ("worldNumber", worldNumber),
                    Query.EQ("identifier", levelIdent)
                    ));
                if (progressLog != null)
                {
                    switch (objectType)
                    {
                        case "checkpoint":
                            valueToReturn = progressLog.checkpointsToCross;
                            break;
                        case "bonus":
                            valueToReturn = progressLog.bonusesIncluded;
                            break;
                        case "ally":
                            valueToReturn = progressLog.alliesToSave;
                            break;
                        case "cave":
                            valueToReturn = progressLog.cavesToOpen;
                            break;
                        default:
                            valueToReturn = progressLog.cavesToOpen +
                                progressLog.bonusesIncluded +
                                //Commented due to "saving" not being possible, thus 100% not possible//progressLog.alliesToSave +
                                progressLog.checkpointsToCross;
                            break;
                    }
                }
            }

            return valueToReturn;

        }

        public void recordLevelAccomplishment(string username, string objectType, string objectIdentifier, string levelName, string worldName)
        {
            username = user.changeStringDots(username, true);
            deployment deploy = new deployment();
            var db = deploy.getDB();
            //Find the overall progress for that level [add 1 if ID is new]
            var progressLog = db.GetCollection<playerProgressInLevel>("playerProgressInLevel");
            var playerProgressLevel = progressLog.FindOneAs<playerProgressInLevel>(Query.And(
                Query.EQ("username", username),
                Query.EQ("levelIdentifier", levelName),
                Query.EQ("worldName", worldName)
                ));
            //Find specific defintion for object [create if not there already]
            var playerLogDefinition = db.GetCollection<playerProgressFullDefinition>("playerProgressFullDefinition");
            long haveTheyDoneThisBefore = playerLogDefinition
                .FindAs<playerProgressFullDefinition>(Query.And(
                Query.EQ("whichLevel", levelName),
                Query.EQ("objectType", objectType),
                Query.EQ("objectIdentifier", objectIdentifier),
                Query.EQ("username", username)
                )).Count();

            if (haveTheyDoneThisBefore == 0)
            {
                //Add the historic entry for this object
                playerProgressFullDefinition newProgressDef = new playerProgressFullDefinition
                {
                    objectIdentifier = objectIdentifier,
                    objectType = objectType,
                    whichLevel = levelName,
                    username = username
                };
                playerLogDefinition.Insert(newProgressDef);
                //Now update the total count for the level

                switch (objectType)
                {
                    case "checkpoint":
                        playerProgressLevel.checkpointsCrossed += 1;
                        break;
                    case "ally":
                        playerProgressLevel.alliesSaved += 1;
                        break;
                    case "cave":
                        playerProgressLevel.cavesOpened += 1;
                        break;
                    case "bonus":
                        playerProgressLevel.bonusesFound += 1;
                        break;
                }
                progressLog.Save(playerProgressLevel);
            }
        }
        public void overalProgress(string username)
        {
            string totalProgressInWorld = "0th";
            int totalProgress = 0;
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var progressDefinition = db.GetCollection<playerProgressInLevel>("playerProgressInLevel");
            string username2 = user.changeStringDots(username, true);
            var levelProgressToUpdate = progressDefinition.FindAs<playerProgressInLevel>(Query.EQ("username", username2));
            var worldName = "";
            int checking = 1;
            string whyLocked = "";

            foreach (var item in levelProgressToUpdate)
            {
                var levelStart = db.GetCollection<levelList>("levelList");
                var level = levelStart.FindOne(Query.EQ("fullName", item.levelIdentifier));
                string checkWorldName = level.worldName;
                long levelCount = progressDefinition.Find(Query.And(
                    Query.EQ("worldName", item.worldName),
                    Query.EQ("username", username2)
                    )).Count();

                var levelBonus = targetProgressCount(username, true, level.identifier, 1, "bonus");
                var levelCave = targetProgressCount(username, true, level.identifier, 1, "cave");
                var levelAllies = targetProgressCount(username, true, level.identifier, 1, "ally");
                var levelCheckpoint = targetProgressCount(username, true, level.identifier, 1, "checkpoint");
                var playerBonus = targetProgressCount(username, false, level.identifier, 1, "bonus");
                var playerCave = targetProgressCount(username, false, level.identifier, 1, "cave");
                var playerAllies = targetProgressCount(username, false, level.identifier, 1, "ally");
                var playerCheckpoint = targetProgressCount(username, false, level.identifier, 1, "checkpoint");


                int rankCount = rankInLevelOrWorld(level.fullName, username2, false);
                if (worldName != checkWorldName)
                {
                    worldName = checkWorldName;
                    totalProgress = 0;
                    checking = 1;
                }

                totalProgress += rankCount;

                if (checking == levelCount)
                {
                    totalProgressInWorld = returnRankNameFromNumber((totalProgress / levelCount).ToString());

                }
                string rankName = returnRankNameFromNumber(rankCount.ToString());

                checking += 1;

                var levelStartNotification = levelStart.FindOne(Query.And(Query.EQ("worldName", item.worldName), Query.EQ("number", checking)));
                if (levelStartNotification != null)
                {
                    whyLocked = "Get to the next level by, " + levelStartNotification.whyLocked;
                }
                else
                {
                    whyLocked = "You've done this world, congratulations! Have you got 100%?";
                }

                //Clients.All.SendAsync("DisplayFullProgress",rankName, level.fullName, levelBonus, levelCave, levelAllies, levelCheckpoint, playerBonus, playerCave, playerAllies, playerCheckpoint, level.worldName, totalProgressInWorld, username, whyLocked);
            }

        }

        public int rankInLevelOrWorld(string objectIdentifier, string username, bool isWorld)
        {
            var continuing = true;
            var position = 0;
            var db = deploy.getDB();
            var objectList = db.GetCollection<playerProgressInLevel>("playerProgressInLevel").Find(Query.And(Query.EQ("levelIdentifier", objectIdentifier))).ToList();
            if (isWorld)
            {

            }

            foreach (var item in objectList.OrderByDescending((m => m.alliesSaved + m.bonusesFound + m.cavesOpened + m.checkpointsCrossed)))
            {
                if (continuing)
                {
                    if (item.username == username)
                    {
                        continuing = false;
                    }
                    position += 1;
                }
            }
            return position;
        }

        public string returnRankNameFromNumber(string numberToUpdate)
        {
            string characterToAdd = "th";
            switch (numberToUpdate.Substring(numberToUpdate.Length - 1))
            {
                case "1":
                    if (numberToUpdate != "11")
                    {
                        characterToAdd = "st";
                    }
                    break;
                case "2":
                    if (numberToUpdate != "12")
                    {
                        characterToAdd = "nd";
                    }
                    break;
                case "3":
                    if (numberToUpdate != "13")
                    {
                        characterToAdd = "rd";
                    }
                    break;
            }

            return numberToUpdate += characterToAdd;
        }

        public void levelUniqueProgress(string username, string levelName)
        {
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var progressDefinition = db.GetCollection<playerProgressFullDefinition>("playerProgressFullDefinition")
                .FindAs<playerProgressFullDefinition>(Query.And(Query.EQ("username", username), Query.EQ("whichLevel", levelName)));
            foreach (var item in progressDefinition)
            {
                Clients.All.SendAsync("addLevelProgressObject",item);
            }
        }
    }
}