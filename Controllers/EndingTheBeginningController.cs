using Microsoft.AspNetCore.Mvc;

namespace FollowMe2.Controllers
{
    public class EndingTheBeginningController : Controller
    {
        public ActionResult youllKnowWhatToDo()
        {
            ViewBag.isGame = "yes";
            ViewBag.title = "youllKnowWhatToDo";
            return View();
        }
        public ActionResult theEnemiesAreComing()
        {
            ViewBag.isGame = "yes";
            ViewBag.title = "theEnemiesAreComing";
            return View();
        }
    }
}
