using FollowMe2.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FollowMe2.ViewModels
{
    public class competeViewModel
    {
        public competition comp { get; set; }
        public List<SelectListItem> types = new List<SelectListItem>();
        public List<SelectListItem> prizeTypes = new List<SelectListItem>();
        public List<SelectListItem> recurringTypes = new List<SelectListItem>();
        public List<SelectListItem> levelNames = new List<SelectListItem>();

        public competeViewModel()
        {
            this.types.Add(new SelectListItem { Value = "Race", Text = "Race" });
            this.types.Add(new SelectListItem { Value = "Discovery", Text = "Discovery" });
            this.types.Add(new SelectListItem { Value = "Survival", Text = "Survival" });
            //
            this.prizeTypes.Add(new SelectListItem { Value = "XP", Text = "XP" });
            //
            this.recurringTypes.Add(new SelectListItem { Value = "daily", Text = "daily" });
            this.recurringTypes.Add(new SelectListItem { Value = "weekly", Text = "weekly" });
            this.recurringTypes.Add(new SelectListItem { Value = "monthly", Text = "monthly" });
        }
    }
}