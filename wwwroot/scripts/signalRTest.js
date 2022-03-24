$(document).ready(function () {
    if (document.getElementById("sendButton") !== null) {
        //Disable the send button until connection is established.
        document.getElementById("sendButton").disabled = true;
        window.followMe = window.followMe || {};
        followMe.testSignalRService = new signalR.HubConnectionBuilder().withUrl("/userMethods").build();

        followMe.testSignalRService.on("ReceiveMessage", function (user, message) {
            var li = document.createElement("li");
            document.getElementById("messagesList").appendChild(li);
            // We can assign user-supplied strings to an element's textContent because it
            // is not interpreted as markup. If you're assigning in any other way, you 
            // should be aware of possible script injection concerns.
            li.textContent = `${user} says ${message}`;
        });

        followMe.testSignalRService.start().then(function () {
            document.getElementById("sendButton").disabled = false;
        }).catch(function (err) {
            return console.error(err.toString());
        });

        document.getElementById("sendButton").addEventListener("click", function (event) {
            var user = document.getElementById("userInput").value;
            var message = document.getElementById("messageInput").value;
            followMe.testSignalRService.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            event.preventDefault();
        });
    }
});