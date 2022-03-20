using FollowMe2.Models;
using FollowMe2.Services;
using FollowMe2.ViewModels;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Builders;


namespace FollowMe2.Controllers
{
    public class ConnectController : Controller
    {
        userMethods userChange = new Services.userMethods();
        authServices auth = new authServices();
        deployment deploy = new deployment();
        communityServices comm = new communityServices();
        levelServices level = new levelServices();

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
            var userToQuery = person.FindOne(Query.EQ("username", userChange.changeStringDots(model.username, false)));
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
        public ActionResult levelSelect()
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
                var userToQuery = person.FindOne(Query.EQ("username", userChange.changeStringDots(model.username, false)));
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
        // GET: /Welcome/
        [HttpGet]
        public ActionResult Welcome()
        {
            ViewBag.isGame = "no";
            return View();
        }
        [HttpPost]
        public ActionResult Welcome(Connection model)
        {
            string userFirstPassword = model.FirstPassword;
            if (!ModelState.IsValid)
            {
                ViewBag.connectError = "Please check your data, there appears to be an error";
                return View();
            }
            else
            {
                if (model.Email != null && model.Email != "")//Can't store email "."'s, so will need to have translation service back and to email
                {
                    model.Email = userChange.changeStringDots(model.Email, false);
                }



                if (model.Username != "" && model.Username != null && model.Username.Contains("."))
                {
                    ViewBag.connectError = "Sorry, but a username can't contain a '.'";
                    return View();
                }

                if (model.Username == "" || model.Username == null)
                {
                    model.Username = model.Email;
                    if (model.Email == "" || model.Email == null)
                    {
                        ViewBag.connectError = "Your username or email is required";
                        return View();
                    }
                }

                if ((model.Username == "" || model.Username == null) || (model.Email == "" && model.Email == null))
                {
                    ViewBag.connectError = "Your username or email is required";
                    return View();
                }


                if (model.Register && model.IsVenoir && (model.Email == null || model.Email == ""))
                {
                    ViewBag.connectError = "If you want to be in the community, you must have an email address";
                    return View();
                }

                var db = deploy.getDB();
                var collection = db.GetCollection<userDefined>("userDefined");
                var loginLog = db.GetCollection("loginLog");
                var levels = db.GetCollection("levelList");
                var userExistsCount = collection.Count(Query.EQ("username", model.Username));
                bool firstpasswordValid = false;

                if (model.Register == false && userExistsCount > 0)
                {
                    var toCheckPassword = 0;
                    if (model.FirstPassword != null) { toCheckPassword = model.FirstPassword.GetHashCode(); }
                    firstpasswordValid = auth.checkpassword(model.Username, toCheckPassword);
                    if (firstpasswordValid == false) { ViewBag.connectError = "User Credentials invalid"; return View(); }

                }
                long passwordcount = collection.Count(Query.EQ("password", model.FirstPassword.GetHashCode()));
                long usercount = collection.Count(Query.EQ("username", model.Username));

                long emailcount = 0;
                if (model.Email != null && model.Email != "")//Otherwise they don't have an email and we don't care if it's unique
                {
                    emailcount = collection.Count(Query.EQ("email", model.Email));
                }

                if ((usercount > 0 || emailcount > 0) && model.Register)
                {
                    ViewBag.connectError = "Your username or email already exists, please check your details and login if that's what you want";
                    return View();
                }
                if (usercount < 0 && firstpasswordValid && emailcount == 0)
                {
                    userExistsCount = 0;
                }



                if (userExistsCount == 0 && model.Register == true)
                {
                    auth.registerUser(model.Username, loginLog, userFirstPassword, false, model.Email, model.IsVenoir, model.GoOnline);

                    return RedirectToAction("design", "Connect", new { isRegistering = true });
                }
                //need to count loginLog for single user now, as this is going to be a login here
                var loginLogCount = loginLog.Count(Query.Exists(model.Username));

                if (loginLogCount > 0)//They are already connected, user probably wrong
                {
                    ViewBag.connectError = "You are already connected, check your usernames";
                    return View();
                }
                if (model.Register == false)
                {
                    if (userExistsCount == 0)
                    {
                        ViewBag.connectError = "That user does not exist, please register";
                        return View();
                    }
                }
                //If the count is 0 then they are allowed to connect
                if (userExistsCount > 0 && model.Register == false && loginLogCount == 0)
                {
                    model.Username = userChange.changeStringDots(model.Username, false);
                    var person = db.GetCollection<userDefined>("userDefined");
                    var personToUpdate = person.FindOne(Query.EQ("username", model.Username));
                    personToUpdate.online = model.GoOnline;
                    person.Save(personToUpdate);
                    var newlog = new QueryDocument(model.Username, 1);
                    loginLog.Insert(newlog);

                    return RedirectToAction("levelSelect", "Connect");
                }
                //Invalid settings
                if (userExistsCount > 0 && model.Register)
                {
                    ViewBag.connectError = "That user already exists";
                    return View();
                }
                return View();
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
