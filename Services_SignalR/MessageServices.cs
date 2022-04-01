using System;
using System.Net.Mail;

namespace FollowMe2.Services_SignalR
{
    public class MessageServices
    {
        public string projectionHighlight = "grey";
        public string projectionBackground = "black";
        public string projectionURL = "http://venoirprojection.azurewebsites.net/";

        public string getStyleSheetForEmail(string highlight, string request, string background)
        {
            var styling = "";
            switch (request)
            {
                case "body":
                    styling = " style='background-color:cccccc;'";
                    break;
                case "highlight":
                    styling = " style='color:" + highlight + ";background-color:" + background + "'";
                    break;
                case "right":
                    styling = " style='float:right; height:20%; width:20%;'";
                    break;
            }
            return styling;
        }
        public string getEmailHeader(string color, string background, string sitename)
        {
            return "<body style='background-color:cccccc'>" +
                "<table width='100%'><tr>" +
                "<td colspan='2'><img style='float:right; height:20%; width:20%;' src='http://" + sitename + ".azurewebsites.net/favicon.ico'/></td></tr> " +
                "<tr><td><a " + getStyleSheetForEmail(color, "highlight", background) + "href='http://" + sitename + ".azurewebsites.net/Home/About'>About</a></td>" +
                "<td><a " + getStyleSheetForEmail(color, "highlight", background) + "href='http://" + sitename + ".azurewebsites.net/Home/Contact'>Contact Us</a></td>" +
                "</tr></table>";
        }
        public string getEmailFooter()
        {
            return "Please feel free to ask for any features you want, or something which isn't quite working, we are here to help<br/><br /> Kind Regards,<br/> The venoir Enterprise Team" +
                "</body>";
        }
        public void sendEmail(string type, string parameter1, string paramater2, string parameter3, string parameter4, string background, string highlight, string sitename)
        {
            string styling = "style='background-color:" + background
            + "';color:'" + highlight + "'";
            MailMessage mailTest = new MailMessage();
            mailTest.From = new MailAddress("venoirEnterprises@gmail.com", "venoir Enterprises");
            mailTest.To.Add(new MailAddress(parameter1, "To Name"));

            string html = @"<table " + styling + "><tr><td>";
            switch (type)
            {
                case "archive":
                    mailTest.Subject = "Confirm you are leaving us";
                    html += @"<a href='" + paramater2 + "'" +
                        styling +
                        ">Confirm you are leaving</a></td></tr></table>";
                    break;
                case "supportIn":
                    mailTest.Subject = paramater2;
                    string stringhere = parameter4 +
                       "<p> A case has been sent to our support team for your issue: '" +
                       paramater2 + "'</p>" +
                           "<p> Please bear with us while we look for a solution</p>"
                           + parameter3;
                    html += stringhere;
                    break;
                case "supportMe":
                    mailTest.Subject = paramater2;
                    html += parameter3;
                    if (parameter4 != null)
                    {
                        mailTest.From = new MailAddress(parameter4, "The Customer");
                    }
                    else
                    {
                        mailTest.From = new MailAddress("emailNotProvided@customer.com", "The Customer");
                    }
                    break;
                case "beginCompetition":
                    mailTest.From = new MailAddress("venoirEnterprises@gmail.com", "Venoir Enterprises");
                    mailTest.Subject = "A new " + parameter4 + " challenge has been created - " + paramater2;
                    html = @"<p>Hi, " + parameter3 + ",</p><p> You have been set another challenge if you accept.</p><p> You'll need to go to your notifications in followMe to find out more</p>";
                    break;
                case "Forgot":
                    //1 = my mail, 2 = my username, 3 = password link, 4 = company name                    
                    mailTest.From = new MailAddress("venoirEnterprises@gmail.com", "Venoir Enterprises");
                    mailTest.Subject = sitename + " - forgotten password";
                    html = "<p>Hi, " + paramater2 + " it looks like you've forgotten your password</p>" +
                    "<p> If this isn't true, please disregard this mail and notify us separately</p>" +
                    "<p>Otherwise, go <a href='" + parameter3 + "'>here</a> and you should be able to get reconnected</p>";
                    break;
                case "sendCode":
                    // 1 = my mail, 2 = my username, 3 = code link
                    //Needs to run the ibeeonline.tryAuthentication(true) if the code if verified
                    mailTest.Subject = sitename + " - Confirmation token";

                    break;

            }
            mailTest.Body = getEmailHeader(highlight, background, sitename) + html + getEmailFooter();
            mailTest.IsBodyHtml = true;

            //SMTP client and send
            SmtpClient smtpClient = new SmtpClient("smtp.sendgrid.net", Convert.ToInt32(587));

            var emailUsername = System.Environment.GetEnvironmentVariable("sendGrid_user");
            var emailPassword = System.Environment.GetEnvironmentVariable("sendGrid_password");

            //Have to be removed on release

            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential(emailUsername, emailPassword);
            smtpClient.Credentials = credentials;

            smtpClient.Send(mailTest);
        }
    }
}