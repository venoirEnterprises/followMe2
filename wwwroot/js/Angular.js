////angular.module('angularUsers', []).controller('usernameAngController', ['$scope', function ($scope) {
////    $scope.otherPlayerData = [];
////    // $scope.query = '';


////    $.getJSON("/playerCommunity/getOtherPlayers",
////          {
////              username: localStorage.getItem("username")
////          }, function (data) {

////              $scope.$apply
////                  (function () {
////    //              $scope.query = '';
////                  $scope.reverse = true;
////                  $.each(data, function (item, data) {
////                      data.playerStatus = "notifyStatus0"
////                      if (data.lastLoggedOut < data.lastActive) {
////                          if(data.friendStatus == 2)
////                          {
////                              data.playerStatus = "notifyStatus3";
////                          }                          
////                      }
////                      if (data.friendStatus != undefined && data.lastLoggedOut > data.lastActive) {
////                          data.playerStatus = "notifyStatus" + data.friendStatus.toString(); 
////                      }
////                      //alert(data.username + ", " + data.friendStatus)
////                  });
////              });
////              $scope.otherPlayerData = data;

////          });
////    $scope.otherPlayersSortType = 'playerStatus'; // set the default sort type
////    $scope.otherPlayersSortReverse = true;  // set the default sort order

////    $scope.showOtherPlayer = function (e) {
////        followMe.otherPlayerFromList(e);
////    }
////    $scope.notifcationsData = "";
////    $scope.notificationIdentifier = 0
////    $.getJSON("/playerCommunity/getUnreadNotifications",
////        {
////            username: localStorage.getItem("username")
////        }, function (data) {
////            var appendNotificationAction = "";
            
////            $.each(data, function (item, data) {
////                data.firstNotifyClick = data.from + "," + data.type
////                switch(data.type)
////                {
////                    case "add":                       
////                        data.firstNotifyButtonMessage = "Confirm";
////                        data.secondMessage = true;
////                        data.secondNotifyButtonMessage = "Remove";
////                        break;
////                    case "confirm":
////                        data.firstNotifyButtonMessage = "View";
////                        data.secondMessage = false;
////                        break;
////                    case "newMessage":
////                        data.firstNotifyButtonMessage = "View";
////                        data.secondMessage = true;
////                        data.secondNotifyButtonMessage = "Ignore";
////                        break;
////                    case "remove":
////                        data.firstNotifyButtonMessage = "Mark as read"
////                        data.secondMessage = false
////                        break;
////                    case "help":
////                        data.firstNotifyButtonMessage = "Accept"
////                        data.secondMessage = true
////                        data.secondNotifyButtonMessage = "Remove"
////                        break;
////                    case "removeHelp":
////                        data.firstNotifyButtonMessage = "Read"
////                        data.secondMessage = false;
////                        break;
////                    case "helpAgreed":
////                        data.firstNotifyButtonMessage = "Read"
////                        data.secondMessage = false;
////                        break;
////                    case "newChallenge":
////                        data.firstNotifyButtonMessage = "Ignore";
////                        data.secondMessage = true;
////                        data.secondNotifyButtonMessage = "Go!"
////                        break;
////                    default:
////                        alert("type: " + data.type + "[" + data.type.length + "], not supported")
////                }
////                $scope.notificationIdentifier += 1;
////            });
////            $scope.notifcationsData = data;
////        });

////    $scope.notifyAction = function (processString, first)
////    {
////        //alert(processString.type + ", "+ first);
////        if (processString != undefined) {
////            var username = processString.from;
////            switch (processString.type + first.toString()) {
////                case "addtrue":
////                    //alert(username + " toConfirm");                    
////                    followMe.communityServices.server.editFriendRequest(processString.from, processString.to, processString.type, true)
////                    followMe.communityServices.server.addNotificationToPlayer(processString.from, processString.to, "confirm", "");
////                    followMe.otherPlayerFromList(processString);
////                    break;
////                case "addfalse":
////                    followMe.communityServices.server.editFriendRequest(processString.from, processString.to, processString.type, false)
////                    followMe.communityServices.server.addNotificationToPlayer(processString.from, processString.to, "remove", "");
////                    break;
////                case "confirmtrue":
////                    followMe.otherPlayerFromList(processString);
////                    followMe.communityServices.server.readNotification(processString.from, processString.to, processString.type,"")
////                    break;
////                case "newMessagetrue":
////                    followMe.otherPlayerFromList(processString);
////                    followMe.readNotificationServer(processString)
////                    break;
////                case "newMessagefalse":
////                    followMe.readNotificationServer(processString)
////                    break;
////                case "removetrue":
////                    followMe.readNotificationServer(processString)
////                    break;
////                case "helptrue":
////                    followMe.readNotificationServer(processString)
////                    followMe.communityServices.server.addNotificationToPlayer(processString.from, processString.to, "helpAgreed", processString.content.substring(processString.content.indexOf("level: ")));
////                    followMe.communityServices.server.confirmHelp(processString.from, processString.to,processString.content.substring(processString.content.indexOf("level:") + 7))                    
////                    break;
////                case "helpfalse":
////                    followMe.readNotificationServer(processString)
////                    followMe.communityServices.server.addNotificationToPlayer(processString.from, processString.to, "removeHelp", processString.content.substring(processString.content.indexOf("level: ")));
////                    break;                
////                case "removeHelptrue":
////                    followMe.readNotificationServer(processString)
////                    break;
////                case "helpAgreedtrue":
////                    followMe.readNotificationServer(processString)                    
////                    break;
////                case "newChallengetrue":
////                    followMe.readNotificationServer(processString);
////                    break;
////                case "newChallengefalse":
////                    alert("redirect to level + ?Challenge=mode, just as the notification should in game")
////                    break;
////            }
////        }
////    }
////}]);


////$(function () {

////    followMe.readNotificationServer = function(objectDefined)
////    {
////        followMe.communityServices.server.readNotification(objectDefined.from, objectDefined.to, objectDefined.type, objectDefined.content)
////    }

////    $(document).bind('pageinit', function (event) {
////        $("#otherPlayerDetails").hide();
////        $(".playersAngular th a").attr("class", "").addClass("heading");
////        $('button').removeClass('link').addClass('linkBorder');
////        $('input').removeClass('link').addClass('linkBorder');
////        $("#game a").removeClass("heading").addClass("linkBorder");
////        $('.playersAngular a').removeClass('link').removeClass('linkBorder').addClass('heading');
////        $('.playersAngular button').removeClass('link').removeClass('linkBorder').addClass('linkNoBorder');
////    });

////    followMe.editAddFriendButton = function (friendStatus) {
////        switch (friendStatus) {
////            case 0:
////                $("#add").text("Add")
////                break;
////            case 1:
////                $("#add").text("Add request sent")
////                break;
////            case 2:
////                $("#add").text("Remove")
////                break;
////        }
////    }

////    $("#myNotifcations button").off().on("click", function () {
////        $(this).parent().parent().remove();
////        if($("#myNotifcations tr").length == 1)
////        {
////            $("#myNotifcations table").remove();
////            $("#myNotifcations").append("<p>You currently have no new notifications</p>");
////        }
////    })

////    followMe.otherPlayerFromList = function (e) {
////        if (e.username == undefined) {
////            followMe.otherPlayername = e.from            
////        }
////        else {
////            followMe.otherPlayername = e.username;
////        }
////        $("#otherPlayerDetails").show("slow")
        
////        $("#otherPlayerName").text(followMe.otherPlayername)
////        followMe.memServer.server.getWeapon(followMe.otherPlayername, true, true);
////        $.getJSON("/playerCommunity/getOtherPlayer",
////            {
////                rank: e.rank,
////                forWho: followMe.otherPlayername,
////                whoInPage: followMe.players[1].username
////            }, function (data) {
////                $("#helping").hide();
////                followMe.setPlayerDesign(false, data, true)
////                $("#otherXP").attr("max", data.maxXP).val(data.XP);
                
////                followMe.friendStatus = data.friendStatus //So that they see the right status [add to not added etc.]
                
////                if (data.friendStatus > 1) {
////                    if (data.online == true) {
////                        $("#helping").show();
////                        $("#levelNameForHelp").html("<option value='0'>Which level?</option>")
////                        $.each(data.levelsToHelp, function (item, data2) {
////                            if (data2.Value.length > 1 && data2.Text.length > 1) {
////                                $("#levelNameForHelp").append("<option value='" + data2.Text + "'>" + data2.Text + "<option>")
////                            }
////                            $("#otherPlayerDetails span").remove()
////                            $("#levelNameForHelp option").last().remove();
////                        });
////                    }
////                    else
////                    {
////                        $("#helping").hide();
////                    }
////                    $("#otherPlayerChat p").remove()
////                    $("#otherPlayerChat").show();
////                    //var other = false;
////                    $.getJSON("/playerCommunity/getMessages",
////                        {
////                            forUser: followMe.players[1].username,
////                            to: followMe.otherPlayername
////                        }, function (data) {

////                            $.each(data, function (item, data) {
////                                //if (data.from == "you") {
////                                //    other = false
////                                //}
////                                followMe.updateMessageForPlayer(data.from, data.message, data.from)
////                            })
////                        });
////                }
////                else {
////                    if (followMe.helpRequest == null) {
////                        $("#otherPlayerChat").hide();
////                    }
////                }

////                followMe.editAddFriendButton(followMe.friendStatus);
////            })
////    }
////});