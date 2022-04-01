using FollowMe2.Services;
using FollowMe2.Services_SignalR;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Welcome}/{id?}");
app.MapHub<UserMethods>("/userMethods"); 
app.MapHub<AuthServices>("/authServices");
app.MapHub<LevelServices>("/levelServices");
app.MapHub<MultiplayerServices>("/multiplayerServices");
app.MapHub<CommunityServices>("/communityServices");

app.Run();
