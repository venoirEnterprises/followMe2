using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FollowMe2.Models
{
    public class levelList
    {
        public ObjectId _id { get; set; }
        public int worldNumber { get; set; }
        public int number { get; set; }
        public string fullName { get; set; }
        public string identifier { get; set; }
        public string worldName { get; set; }
        public int alliesToSave { get; set; }
        public int bonusesIncluded { get; set; }
        public int checkpointsToCross { get; set; }
        public int cavesToOpen { get; set; }
        public string whyLocked { get; set; }
    }


    public class playerProgressInLevel
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }
        public string levelIdentifier { get; set; }
        public string worldName { get; set; }
        public int alliesSaved { get; set; }
        public int bonusesFound { get; set; }
        public int checkpointsCrossed { get; set; }
        public int cavesOpened { get; set; }
        public float quickestSecondsToFinish { get; set; }
    }

    public class playerProgressFullDefinition
    {
        public ObjectId _id { get; set; }
        public string whichLevel { get; set; }
        public string objectType { get; set; }
        public string objectIdentifier { get; set; }
        public string username { get; set; }
    }

    public class overallProgress
    {
        public string level { get; set; }
        public string world { get; set; }
        public int levelCheckpoints { get; set; }
        public int playerCheckpoints { get; set; }
        public int levelCaves { get; set; }
        public int playerCaves { get; set; }
        public int levelEnemies { get; set; }
        public int playerAllies { get; set; }
        public int levelBonuses { get; set; }
        public int playerBonuses { get; set; }
    }
}