using FollowMe2.Models;
using FollowMe2.Services;
using MongoDB.Driver.Builders;
using MongoDB.Driver;

namespace FollowMe2.ViewModels
{
    public class achievementsAwardsViewModel
    {
        public userDefined ud { get; set; }
        public List<statsForXP> achievementsList { get; set; }
        public achievementsAwardsViewModel()
        {
            deployment deploy = new deployment();
            var server = deploy.getMongoClient();
            var mongo = server.GetServer();
            var db = mongo.GetDatabase("followme");
            var statsForXpAll = db.GetCollection<statsForXP>("xpStats");
            this.achievementsList = statsForXpAll.Find(Query.EQ("special", 1)).ToList();
        }
    }
}