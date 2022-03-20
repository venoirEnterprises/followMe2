using FollowMe2.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace followMe.ViewModels
{
    public class userDefinedViewModel
    {
        public userDefined user = new userDefined();
        public List<SelectListItem> difficulties = new List<SelectListItem>();
        public string username;
        
        public userDefinedViewModel()
        {
            this.difficulties.Add(new SelectListItem { Text = "Easy", Value = "0" });
            this.difficulties.Add(new SelectListItem { Text = "Standard", Value = "1" });
            this.difficulties.Add(new SelectListItem { Text = "Challenging", Value = "2" });
            this.difficulties.Add(new SelectListItem { Text = "Are you sure?", Value = "3" });
        }               
    }
}