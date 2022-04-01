using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FollowMe2.Models;
using FollowMe2.Services_SignalR;
using MongoDB.Driver.Builders;

namespace followMe.ViewModels
{
    public class overallProgressViewModel
    {
        CommunityServices comm = new CommunityServices();
        public userDefined user = new userDefined();


        
    }
}