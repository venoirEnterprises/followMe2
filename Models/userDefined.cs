using MongoDB.Bson;
using System;
using System.ComponentModel.DataAnnotations;

namespace FollowMe2.Models
{
    public class social
    {
        public bool friendlyFire { get; set; }
        public bool socialOnly { get; set; }
        public bool rankOnline { get; set; }
        public bool shareXPInHelp { get; set; }
    }

    public class userDefined : social
    {
        public ObjectId _id { get; set; }
        public int lives { get; set; }
        public string username { get; set; }
        public int world { get; set; }
        public string level { get; set; }
        public int checkpoint { get; set; }
        public int head { get; set; }
        public int chest { get; set; }
        public int legs { get; set; }
        public float health { get; set; }
        public bool usesPassword { get; set; }
        public int password { get; set; }
        public int weaponID { get; set; }
        public float maxHealth { get; set; }
        //KEYBOARD START
        public int up { get; set; }
        public int left { get; set; }
        public int surrender { get; set; }
        public int right { get; set; }
        public int enter { get; set; }
        public int special { get; set; }
        public int build { get; set; }
        //KEYBOARD END
        public int rank { get; set; }//Hence XPPerRank and statsPerRank
        public int XP { get; set; }
        public string personType { get; set; }
        //Progress
        public float levelPlayTime { get; set; }
        public int difficulty { get; set; }
        //Community
        public string email { get; set; }
        public bool isVenoir { get; set; }
        public bool online { get; set; }
        public bool hasSurvived { get; set; }

        public DateTime lastActive { get; set; }
        public DateTime lastLoggedOut { get; set; }
    }
    public class weapon
    {
        public ObjectId _id { get; set; }
        public int identifierToSee { get; set; }
        public int hurt { get; set; }
        public int rate { get; set; }//Every five seconds
        public int weaponLevel { get; set; }
    }
    public class levelAccess
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }
        public string level { get; set; }
        public int world { get; set; }
    }
    public class statsForRank
    {
        public ObjectId _id { get; set; }
        public int rank { get; set; }
        public float pace { get; set; }
        public int health { get; set; }
        public float weaponHarmMultiplier { get; set; }
        public float jumpHeightMultiplier { get; set; }
        public int numberOfLives { get; set; }
    }
    public class statsForXP
    {
        public ObjectId _id { get; set; }
        public int internalID { get; set; }
        public int specialID { get; set; }
        public string type { get; set; }
        public string action { get; set; }
        public int xpPoints { get; set; }
        public bool special { get; set; }
        public string message { get; set; }
        public int numberToDo { get; set; }
        public bool oncePerLevel { get; set; }
    }
    public class xpToRank
    {
        public ObjectId _id { get; set; }
        public int rank { get; set; }
        public int maxXP { get; set; }
    }
    public class xpStatsUserLog
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }
        public string actionType { get; set; }
        public bool isBlocker { get; set; }
        //if false then just log of kill number etc. otherwise, shouldn't be shown
        public string forSpecial { get; set; }
        //If not special, it is per something, this declares what e.g. Level
        public string nonSpecialDefinition { get; set; }
        //This declares what it is called [usually level] e.g. youllKnowWhatToDo
        public int numberDone { get; set; }
    }

    public class notification
    {
        public ObjectId _id { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string content { get; set; }
        public bool read { get; set; }
        public string type { get; set; }
        public DateTime when { get; set; }
        public int rank { get; set; }
    }
    public class addRequest
    {
        public ObjectId _id { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public bool approved { get; set; }
    }
    public class playerMessages
    {
        public ObjectId _id { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string message { get; set; }
        public DateTime when { get; set; }
    }
    public class helpRequest
    {
        public ObjectId _id { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string level { get; set; }
        public string world { get; set; }
        public bool done { get; set; }
        public int difficulty { get; set; }
        public bool confirmed { get; set; }
    }
}