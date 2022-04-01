using FollowMe2.Services;
using Microsoft.AspNetCore.Mvc;

namespace followMe2.Controllers
{
    public class PlayerController : Controller
    {        
        PlayerServices playerServices = new PlayerServices();

        [HttpPost]
        public ActionResult Surrender(string username) {
            playerServices.surrender(username);
            return RedirectToAction("LevelSelect", "Connect");
        }
    }
}
