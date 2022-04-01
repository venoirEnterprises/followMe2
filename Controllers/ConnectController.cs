using FollowMe2.Models;
using FollowMe2.Services_SignalR;
using FollowMe2.Services;
using FollowMe2.ViewModels;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver.Builders;


namespace FollowMe2.Controllers
{
    public class ConnectController : Controller
    {
        UserMethods userChange = new UserMethods();
        AuthServices auth = new AuthServices();
        Deployment deploy = new Deployment();
        CommunityServices comm = new CommunityServices();
        LevelServices level = new LevelServices();
        PlayerServices playerServices = new PlayerServices();

        public JsonResult getRedirection(string username)
        {
            return Json(level.redirectToWorld(-1, null, username));
        }

        //GET: /options/
        [HttpGet]
        public ActionResult options()
        {
            ViewBag.isGame = "no";
            return View();
        }
        [HttpPost]
        public ActionResult options(userDefined model)
        {
            var db = deploy.getDB();
            var levels = db.GetCollection<levelList>("levelList");
            var person = db.GetCollection<userDefined>("userDefined");
            userDefined userToQuery = person.FindOne(Query.EQ("username", playerServices.changeStringDots(model.username, false)));
            //We need to check the model isn't passing 0 because it takes a second for the UI to load the actual parameters with the dropdowns and so on
            //Or the UI might not keep up
            //Otherwise submit as normal
            //If it is 0, continue with the model
            if (model.up > 0) { userToQuery.up = model.up; }
            if (model.right > 0) { userToQuery.right = model.right; }
            if (model.surrender > 0) { userToQuery.surrender = model.surrender; }
            if (model.left > 0) { userToQuery.left = model.left; }
            if (model.enter > 0) { userToQuery.enter = model.enter; }
            if (model.special > 0) { userToQuery.special = model.special; }
            if (model.build > 0) { userToQuery.build = model.build; }

            if (model.difficulty > 0)
            {
                userToQuery.difficulty = model.difficulty;
            }
            userToQuery.isVenoir = model.isVenoir;
            userToQuery.online = model.online;
            if (model.online)
            {
                userToQuery.email = model.email;
                //Community
                userToQuery.friendlyFire = model.friendlyFire;
                userToQuery.socialOnly = model.socialOnly;
                userToQuery.rankOnline = model.rankOnline;
                userToQuery.shareXPInHelp = model.shareXPInHelp;
                //Community end
            }

            person.Save(userToQuery);
            levelList world = level.redirectToWorld(userToQuery.world, userToQuery.level, "");//username should just comefrom cient
            return RedirectToAction(world.fullName, world.worldName);

        }

        //GET: /levelSelect/      
        public ActionResult LevelSelect()
        {
            ViewBag.isGame = "yes";
            return View();
        }

        public ActionResult achievementsAwards()
        {
            ViewBag.isGame = "no";
            return View(new achievementsAwardsViewModel());
        }

        //GET: /Design/
        [HttpGet]
        public ActionResult design(bool? isRegistering)
        {
            ViewBag.registration = isRegistering;
            ViewBag.isGame = "no";
            return View();
        }
        //POST: /Design/
        [HttpPost]
        public ActionResult design(userDefined model)
        {
            if (model.personType == null || model.personType == "")
            {
                ViewBag.isGame = "no";
                ViewBag.registration = true;
                ViewBag.connectError = "You must select a person type";
                return View();
            }
            else
            {

                var db = deploy.getDB();
                var person = db.GetCollection<userDefined>("userDefined");
                var userToQuery = person.FindOne(Query.EQ("username", playerServices.changeStringDots(model.username, false)));
                userToQuery.head = model.head;
                userToQuery.chest = model.chest;
                userToQuery.legs = model.legs;
                userToQuery.weaponID = model.weaponID;
                userToQuery.personType = model.personType;



                if (userToQuery.personType != "1")
                {
                    userToQuery.special = 48;
                    if (userToQuery.personType == "2")
                    {
                        userToQuery.health *= 0.75f;
                        userToQuery.maxHealth *= 0.75f;
                    }
                }

                else
                {
                    userToQuery.health *= 2;
                    userToQuery.maxHealth *= 2;
                }
                person.Save(userToQuery);
                var levels = db.GetCollection<levelList>("levelList");
                var world = levels.FindOne(Query.And(
                    Query.EQ("worldNumber", userToQuery.world),
                    Query.EQ("identifier", userToQuery.level)
                    ));

                comm.addPlayerProgress(model.username, world.fullName, world.worldName);

                return RedirectToAction(world.fullName, world.worldName);
            }
        }
        public ActionResult Help()
        {
            return View();
        }

        public ActionResult plan()
        {
            return View();
        }
    }
}
