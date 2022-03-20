using FollowMe2.Models;
using FollowMe2.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using System.Diagnostics;

namespace FollowMe2.Controllers
{
    public class HomeController : Controller
    {
        userMethods userChange = new userMethods();
        deployment deploy = new deployment();
        authServices auth = new authServices();

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Welcome()
        {
            ViewBag.isGame = "no";
            ViewData["Title"] = "Welcome";
            return View();
        }


        [HttpPost]
        public ActionResult Welcome(Connection model)
        {
            ViewBag.isGame = "no";
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
                    var toCheckPassword = "";
                    if (model.FirstPassword != null) { toCheckPassword = model.FirstPassword; }
                    firstpasswordValid = auth.checkpassword(model.Username, toCheckPassword);
                    if (firstpasswordValid == false) { ViewBag.connectError = "User Credentials invalid"; return View(); }

                }
                long passwordcount = collection.Count(Query.EQ("password", auth.hashPassword(model.FirstPassword)));
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

        public IActionResult Privacy()
        {
            ViewBag.isGame = "no";
            return View();
        }

        public IActionResult Test(int id)
        {
            ViewData["Title"] = "Test";
            ViewData["id"] = id;
            ViewBag.isGame = "no";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}