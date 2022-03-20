using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FollowMe2.Models
{
    public class competition
    {
        public ObjectId _id { get; set; }
        [Display(Name = "Give me a name!"),Required]
        public string competeName { get; set; }
        [Display(Name="What kind of competition?")]
        public string type { get; set; }
        [Display(Name="Begins: "), DataType(dataType: DataType.Date)]
        public DateTime start { get; set; }
        [Display(Name = "End: "), DataType(dataType: DataType.Date)]
        public DateTime end { get; set; }
        [Display(Name = "The winner gets?")]
        public string prizeType { get; set; }
        [Display(Name = "Do you want this to repeat?")]
        public bool recurring { get; set; }
        [Display(Name = "How?")]
        public string recurringType { get; set; }
        [Display(Name = "Should this only be for your friends?")]
        public bool inviteOnly { get; set; }
        [Display(Name = "Which level is this for?")]
        public string levelName { get; set; }
        public string createdBy { get; set; }
    }
}