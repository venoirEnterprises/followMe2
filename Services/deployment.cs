using MongoDB.Driver;

namespace FollowMe2.Services
{
    public class deployment
    {
        public MongoClient getMongoClient()
        {
            var server = new MongoClient("mongodb://127.0.0.1:27017");
            //var server = new MongoClient("mongodb://admin:Password12@ds039880.mongolab.com:39880/followme");
            //PUBLISH - var server = new MongoClient((System.Environment.GetEnvironmentVariable("mongo_login")));
            return server;
        }
        public MongoDatabase getDB()
        {
            var server = getMongoClient();
            var mongo = server.GetServer();
            return mongo.GetDatabase("followme");
        }
    }
}