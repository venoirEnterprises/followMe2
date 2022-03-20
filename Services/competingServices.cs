using FollowMe2.Models;
using MongoDB.Driver.Builders;
using System.Collections.Generic;
using System.Linq;

namespace FollowMe2.Services
{
    public class competingServices
    {
        public communityServices comm = new communityServices();
        public deployment deploy = new deployment();
        messageServices messaging = new messageServices();

        public bool checkCreateCompetition(competition comp)
        {
            bool dataRunsUniquely = false;
            var db = deploy.getDB();
            var countDuplicate = db.GetCollection("competitions").Find(Query.And(
                Query.EQ("levelName", comp.levelName),
                Query.EQ("type", comp.type),
                    Query.Or(
                        Query.And(Query.GTE("start", comp.start), Query.LTE("end", comp.end)),
                        Query.And(Query.LTE("start", comp.start), Query.GTE("end", comp.start)),
                        Query.And(Query.LTE("start", comp.end), Query.GTE("end", comp.end))//Definitely needs testing
                ))).Count();

            if (countDuplicate < 1)
            {
                dataRunsUniquely = true;
                db.GetCollection("competitions").Insert(comp);
            }

            return dataRunsUniquely;
        }

        public void notifyCompetitionMembers(competition comp)
        {
            var db = deploy.getDB();
            string levelIdentifier = db.GetCollection("levelList").FindOneAs<levelList>(Query.EQ("fullName", comp.levelName)).identifier;
            List<string> potentialCompetitorNames = new List<string>();
            potentialCompetitorNames = db.GetCollection("levelAccess").FindAs<levelAccess>(Query.EQ("level", levelIdentifier)).Select(m => m.username).ToList();

            foreach (var item in potentialCompetitorNames)
            {
                if (comm.getMyLevels(item, true).Contains(comp.levelName))
                {
                    userDefined notifyUser = db.GetCollection("userDefined").FindOneAs<userDefined>(Query.EQ("username", item));
                    if (notifyUser != null && notifyUser.isVenoir && notifyUser.online)
                    {
                        messaging.sendEmail("beginCompetition", notifyUser.email, comp.competeName, notifyUser.username, comp.type, "white", "lightblue", "venoirFollowMe");
                        comm.addNotificationToPlayer(item, comp.createdBy, "newChallenge", comp.levelName, comp.type);
                    }
                }
            }
        }

    }
}