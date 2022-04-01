using FollowMe2.Services_SignalR;
using Microsoft.AspNetCore.Mvc;
using FollowMe2.Models;
using MongoDB.Driver.Builders;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FollowMe2.Controllers
{
    public class otherPlayer : userDefined
    {
        public int maxXP { get; set; }
        public int friendStatus { get; set; }
        public List<SelectListItem> levelsToHelp = new List<SelectListItem>();
    }


    public class playerCommunityController : Controller
    {
        public Deployment deploy = new Deployment();
        public CommunityServices comm = new CommunityServices();
        public LevelServices level = new LevelServices();

        public JsonResult checkFriendStatus(string me, string them)
        {
            var db = deploy.getDB();
            var isFriend = false;
            long countFriend = db.GetCollection("addRequests").Find(Query.And(Query.EQ("from", me), Query.EQ("to", them), Query.EQ("approved", true))).Count();
            countFriend += db.GetCollection("addRequests").Find(Query.And(Query.EQ("to", me), Query.EQ("from", them), Query.EQ("approved", true))).Count();

            if (countFriend > 0)
            {
                isFriend = true;
            }
            return Json(isFriend);
        }

        public JsonResult getMessages(string forUser, string to)
        {
            var db = deploy.getDB();
            List<playerMessages> newMessagesFrom = db.GetCollection<playerMessages>("playerMessages").Find(Query.And(
                Query.EQ("to", forUser),
                Query.EQ("from", to))).ToList();
            List<playerMessages> newMessagesTo = db.GetCollection<playerMessages>("playerMessages").Find(Query.And(
                Query.EQ("to", to),
                Query.EQ("from", forUser))).ToList();
            foreach (var item in newMessagesTo)
            {
                newMessagesFrom.Add(new playerMessages
                {
                    to = to,
                    from = "you",
                    message = item.message,
                    when = item.when
                });
            }
            return Json(newMessagesFrom.OrderBy(m => m.when));
        }

        public JsonResult getOtherPlayers(string username)
        {
            var db = deploy.getDB();
            List<userDefined> beginPlayers = db.GetCollection<userDefined>("userDefined").Find(Query.And(
                Query.EQ("isVenoir", true),
                Query.NE("username", username)
                )).ToList();

            List<otherPlayer> otherPlayers = new List<otherPlayer>();
            foreach (var item in beginPlayers)
            {
                otherPlayers.Add(new otherPlayer
                {
                    username = item.username,
                    rank = item.rank,
                    lastLoggedOut = item.lastLoggedOut,
                    lastActive = item.lastActive,
                    friendStatus = comm.getFriendStatus(item.username, username)
                });
            }

            return Json(otherPlayers);
        }

        public JsonResult getOtherPlayer(int rank, string whoInPage, string forWho)
        {
            var db = deploy.getDB();
            otherPlayer otherPlayer = new otherPlayer { };
            userDefined otherPlayerDesign = db.GetCollection<userDefined>("userDefined").FindOne(Query.EQ("username", forWho));
            userDefined playerRequesting = db.GetCollection<userDefined>("userDefined").FindOne(Query.EQ("username", whoInPage));
            xpToRank xpRankDefined = db.GetCollection<xpToRank>("xpToRank").FindOne(Query.EQ("rank", rank));

            otherPlayer.maxXP = xpRankDefined.maxXP;
            otherPlayer.head = otherPlayerDesign.head;

            otherPlayer.chest = otherPlayerDesign.chest;
            otherPlayer.legs = otherPlayerDesign.legs;
            otherPlayer.XP = otherPlayerDesign.XP;
            otherPlayer.level = otherPlayerDesign.level;
            otherPlayer.world = otherPlayerDesign.world;
            otherPlayer.rank = otherPlayerDesign.rank;
            otherPlayer.online = otherPlayerDesign.online;

            otherPlayer.friendStatus = comm.getFriendStatus(whoInPage, forWho);

            var levelNamesForOther = db.GetCollection<levelAccess>("levelAccess").Find(Query.EQ("username", otherPlayerDesign.username));
            var levelNamesForRequested = db.GetCollection<levelAccess>("levelAccess").Find(Query.EQ("username", playerRequesting.username));

            foreach (var item in levelNamesForOther)
            {
                string fullLevelName = db.GetCollection<levelList>("levelList").FindOne(Query.EQ("identifier", item.level)).fullName;
                foreach (var item2 in levelNamesForRequested)
                {
                    if (item2.level == item.level &&
                        (db.GetCollection("helpRequests").Find(Query.And(Query.EQ("to", otherPlayerDesign.username), Query.EQ("from", playerRequesting.username), Query.EQ("level", fullLevelName))).Count()
                        + db.GetCollection("helpRequests").Find(Query.And(Query.EQ("from", otherPlayerDesign.username), Query.EQ("to", playerRequesting.username), Query.EQ("level", fullLevelName))).Count())
                        < 1)
                    {
                        otherPlayer.levelsToHelp.Add(new SelectListItem { Value = item.level, Text = db.GetCollection("levelList").FindOneAs<levelList>(Query.EQ("identifier", item.level)).fullName });
                    }
                }
            }

            return Json(otherPlayer);
        }

        public JsonResult getUnreadNotifications(string username)
        {
            var db = deploy.getDB();
            List<notification> notifications = db.GetCollection<notification>("notifications").Find(Query.And(
                Query.EQ("to", username),
                Query.EQ("read", false))).ToList();
            return Json(notifications);
        }

        public JsonResult getMyLevels(string username, bool onlyDone)//no worlds as of 1.12.5
        {
            return Json(comm.getMyLevels(username, onlyDone));
        }
    }
}