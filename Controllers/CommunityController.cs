using Microsoft.AspNetCore.Mvc;
using FollowMe2.ViewModels;
using System;
using FollowMe2.Services;

namespace followMe.Controllers
{
    public class CommunityController : Controller
    {
        public competingServices comp = new competingServices();
        [HttpGet]
        public ActionResult players()
        {
            ViewBag.isCommunity = true;//Styling act
            ViewBag.isGame = "no";
            return View();
        }
        [HttpGet]
        public ActionResult competitions()
        {
            ViewBag.isCommunity = true;//Styling act
            ViewBag.isGame = "no";
            ViewBag.Title = "Competitions";
            return View(new competeViewModel());
        }

        [HttpPost]
        public ActionResult competitions(competeViewModel model)
        {
            ViewBag.isCommunity = true;//Styling act
            ViewBag.isGame = "no";
            ViewBag.Title = "Competitions";
            bool isOk = true;
            ViewBag.validationMessage = "";

            if (model.comp.start <= DateTime.Now && model.comp.start > new DateTime(2015, 1, 1) && model.comp.end > new DateTime(2015, 1, 1))// real date
            {
                ViewBag.validationMessage += "You must start the competition at least tomorrow. ";
                isOk = false;
            }
            if ((model.comp.end < model.comp.start || model.comp.end == model.comp.start))
            {
                ViewBag.validationMessage += "You must have an end date later than it starts. ";
                isOk = false;
            }
            
            if(model.comp.levelName == "0")
            {
                ViewBag.validationMessage += "You must select a level. ";
                isOk = false;
            }
            if (isOk && (model.comp.start < new DateTime(2015, 1, 1) || model.comp.end < new DateTime(2015, 1, 1)))//capture 'other' data errors
            {
                ViewBag.validationMessage = "Please check the dates are valid";
                isOk = false;
            }
            
            if (isOk && comp.checkCreateCompetition(model.comp) == false)//This checks for a duplicate, creates it if unique
            {
                ViewBag.validationMessage = "These details already exist, please try with different dates or type.";
                isOk = false;
            }
            if (isOk == false)
            {
                return View(model);
            }

            else
            {
                comp.notifyCompetitionMembers(model.comp);
                return View(new competeViewModel());                                
            }
        }
    }
}