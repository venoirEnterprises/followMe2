using System.ComponentModel.DataAnnotations;
namespace FollowMe2.Models
{
    public class Connection
    {
        public bool Register { get; set; }
        [Display(Name = "The leader")]
        public string Username { get; set; }
        [Display(Name = "Your password"), Required]
        public string FirstPassword { get; set; }
        [Display(Name = "Your email"), DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Display(Name = "Join the community?")]
        public bool IsVenoir { get; set; }
        [Display(Name = "Go online [rec. Rank 3+]")]
        public bool GoOnline { get; set; }

    }
}