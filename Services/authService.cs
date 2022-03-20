using FollowMe2.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using MongoDB.Driver.Builders;

namespace FollowMe2.Services
{
    public class authServices : Hub
    {
        public void newLevelAccess(string username, string level, int world)
        {
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var levelAccessing = db.GetCollection<levelAccess>("levelAccess");
            if (hasAccessToLevel(username, level, world) == false)
            {
                var levelAccessLog = new QueryDocument("username", username);
                levelAccessLog["level"] = level;
                levelAccessLog["world"] = world;
                levelAccessing.Insert(levelAccessLog);
                //levelAccessing.Save(levelAccessLog);
            }

        }
        public bool hasAccessToLevel(string username, string level, int world)
        {
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var levelAcces = db.GetCollection<levelAccess>("levelAccess");
            var countHasAccess = levelAcces.Find(Query.EQ("username", username))
                .Where(m => m.level == level)
                .Where(m => m.world == world)
                .Count();

            if (countHasAccess > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool checkpassword(string username, int password)
        {
            deployment deploy = new deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            if (password == 0 && userToQuery.usesPassword == false)
            {
                return true;
            }

            if (userToQuery.password.GetHashCode() == password)
            {
                return true;
            }

            return false;
        }
        public void setMplayer(bool multi)
        {
            //var context = GlobalHost.ConnectionManager.GetHubContext<userMethods>();
            //context.Clients.All.setMultiplayer(multi);
        }
        public void registerUser(string username, MongoCollection loginLog, string password, bool second, string email, bool isVenoir, bool online)
        {
            deployment deploy = new deployment();
            var database = deploy.getDB();
            var collection = database.GetCollection<userDefined>("userDefined");

            int left = 65; int right = 68; int up = 87; int surrender = 83; int enter = 13; int build = 16;
            //see keyboard.js

            var userToAdd = new QueryDocument("username", username);
            userToAdd["level"] = "1st";
            userToAdd["world"] = 1;
            userToAdd["checkpoint"] = 0;
            userToAdd["head"] = 0;
            userToAdd["chest"] = 0;
            userToAdd["legs"] = 0;
            userToAdd["health"] = 100;
            userToAdd["maxHealth"] = 100;
            userToAdd["lives"] = 3;
            userToAdd["weaponID"] = -1;
            //keyboard
            userToAdd["left"] = left;
            userToAdd["right"] = right;
            userToAdd["up"] = up;
            userToAdd["surrender"] = surrender;
            userToAdd["enter"] = enter;
            userToAdd["build"] = build;
            //keyboard
            userToAdd["rank"] = 1;
            userToAdd["XP"] = 0;
            userToAdd["levelPlayTime"] = 0;
            if (email != null)
            {
                userToAdd["email"] = email;
            }
            //COMMUNITY
            userToAdd["isVenoir"] = isVenoir;
            userToAdd["online"] = online;
            userToAdd["lastActive"] = DateTime.Now;
            userToAdd["difficulty"] = 1;
            //COMMUNITY end
            //SOCIAL
            userToAdd["friendlyFire"] = false;
            userToAdd["socialOnly"] = false;
            userToAdd["rankOnline"] = true;
            userToAdd["shareXPInHelp"] = true;
            //SOCIAL end

            if (password != "")
            {
                userToAdd["password"] = password.GetHashCode();
                userToAdd["usesPassword"] = true;
            }
            collection.Insert(userToAdd);
            var loginLogAdd = new QueryDocument(username, 1);
            loginLog.Insert(loginLogAdd);
            //collection.Save(userToAdd);
            //loginLog.Save(loginLogAdd);
            newLevelAccess(username, "1st", 1);
        }
    }
}