using FollowMe2.Models;
using FollowMe2.Services_SignalR;
using MongoDB.Driver.Builders;

namespace FollowMe2.Services
{
    public class PlayerServices
    {
        public void surrender(string username)
        {
            username = changeStringDots(username, false);
            Deployment deploy = new Deployment();
            var db = deploy.getDB();
            var person = db.GetCollection<userDefined>("userDefined");
            var userToQuery = person.FindOne(Query.EQ("username", username));
            userToQuery.checkpoint = 0;
            userToQuery.levelPlayTime = 0;
            person.Save(userToQuery);
        }

        public string changeStringDots(string email, bool recover)
        {
            var returnString = "";
            var checkForThis = ".";
            var replaceCharacter = ",";
            if (email != null)
            {
                for (int i = 0; i < email.Length; i++)
                {
                    var characterToCheck = email.Substring(i, 1);
                    var newCharacter = "";
                    if (characterToCheck == checkForThis)
                    {
                        newCharacter = replaceCharacter;
                    }
                    else
                    {
                        newCharacter = characterToCheck;
                    }
                    returnString += newCharacter;

                }
            }
            return returnString;

        }


    }
}
