using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FollowMe2.Models
{
    public class people
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string name { get; set; }
        public string title { get; set; }
    }
    public class imageHeader
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string type { get; set; }
        //public List<image> images { get; set; }
        public imageHeader()
        {
            _id = ObjectId.GenerateNewId();
            //images = new List<image>();
        }
    }
    public class image
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public int systemId { get; set; }
        public bool fan { get; set; }
        public float x { get; set; }
        public float y { get; set; }
        public float widthX { get; set; }
        public float heightY { get; set; }
        public bool animate { get; set; }
        public float startFrame { get; set; }
        public float endFrame { get; set; }
        public bool startpoint { get; set; }
        public string message { get; set; }
        public int checkpoint { get; set; }
        public string newLevel { get; set; }
        public float xend { get; set; }
        public float yend { get; set; }
        public string surfaceAnimationCollection { get; set; }
        public bool backToStartPoint { get; set; }
        public int hurt { get; set; }
        public bool fly { get; set; }
        public float spriteY { get; set; }
        public int maxHealth { get; set; }
        public int world { get; set; }
        public string level { get; set; }
        public string type { get; set; }

        public string imageName { get; set; }
        //caves
        public string caveName { get; set; }
        public float xMove { get; set; }
        public float yMove { get; set; }
        public bool entrance { get; set; }//Can they actually get out the cave?
        public bool inCave { get; set; }
        public bool caveWall { get; set; }
        public bool caveCeiling { get; set; }
        //caves
        public string whyLocked { get; set; }
        //difficulty
        public int hideMinimumDifficulty { get; set; }//only needed if the object isn't shown in anything below highest difficulty
        public int showMinimumDifficulty { get; set; }
    }
}