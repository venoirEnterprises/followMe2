/*
index and uniqueIdentifier to be removed, in place of server-side _id
xMove replaced by maxx
yMove replaced my maxy
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = /** @class */ (function () {
    function GameObject() {
        this._id = "";
        this.x = 0;
        this.y = 0;
    }
    return GameObject;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(health, maxHealth, lives, username, local) {
        var _this = _super.call(this) || this;
        _this.health = health;
        _this.maxHealth = maxHealth;
        _this.lives = lives;
        _this.username = username;
        _this.local = local;
        return _this;
    }
    return Player;
}(GameObject));
var PassiveGameObject = /** @class */ (function (_super) {
    __extends(PassiveGameObject, _super);
    function PassiveGameObject() {
        var _this = _super.call(this) || this;
        _this.widthX = 64;
        _this.heightY = 64;
        _this.hideMinimumDifficulty = 0;
        _this.showMinimumDifficulty = 0;
        _this.caveName = "";
        _this.inCave = false;
        _this.spriteY = 0;
        return _this;
    }
    PassiveGameObject.prototype.setPassiveObjectProperties = function (type, _id, x, y, caveName, hideMinimumDifficulty, showMinimumDifficulty, spriteY, width, height) {
        this.hideMinimumDifficulty = hideMinimumDifficulty;
        this.showMinimumDifficulty = showMinimumDifficulty;
        this._id = _id;
        this.x = x * 64;
        this.y = y * 64;
        this.widthX = width * 64;
        this.heightY = height * 64;
        if (type === "enemies") {
            this.heightY += 8;
        }
        this.spriteY = spriteY;
        this.caveName = caveName || "";
        this.inCave = this.caveName.length > 0 ? true : false;
    };
    PassiveGameObject.prototype.getCaveDetails = function () {
        console.log(this.caveName.length > 0 ? this.caveName + ", in cave? " + this.inCave : "[no cave]");
    };
    return PassiveGameObject;
}(GameObject));
var Weapon = /** @class */ (function (_super) {
    __extends(Weapon, _super);
    function Weapon(hurt, rate, weaponLevel) {
        var _this = _super.call(this) || this;
        _this.hurt = hurt;
        _this.rate = rate;
        _this.weaponLevel = weaponLevel;
        return _this;
    }
    ;
    return Weapon;
}(PassiveGameObject));
;
var Cave = /** @class */ (function (_super) {
    __extends(Cave, _super);
    function Cave(entrance, caveWall, caveCeiling, xMove, //image manipulations
    yMove) {
        var _this = _super.call(this) || this;
        _this.entrance = entrance;
        _this.caveWall = caveWall;
        _this.caveCeiling = caveCeiling;
        _this.xMove = xMove;
        _this.yMove = yMove;
        return _this;
    }
    ;
    return Cave;
}(PassiveGameObject));
;
var AnimatedGameObject = /** @class */ (function (_super) {
    __extends(AnimatedGameObject, _super);
    function AnimatedGameObject(animate, startFrame, endFrame) {
        if (animate === void 0) { animate = false; }
        if (startFrame === void 0) { startFrame = ""; }
        if (endFrame === void 0) { endFrame = 0; }
        var _this = _super.call(this) || this;
        _this.animate = animate;
        _this.startFrame = startFrame;
        _this.endFrame = endFrame;
        return _this;
    }
    AnimatedGameObject.prototype.giveAnimate = function () {
        console.log(this.animate);
    };
    AnimatedGameObject.prototype.setAnimationProperties = function (animate, startFrame, endFrame, type) {
        this.animate = animate;
        switch (type) {
            case "checkpoint":
                this.startFrame = (-64 * startFrame) + "px -64px";
                break;
            case "enemies":
                this.startFrame = (-64 * startFrame) + "px -192px";
                break;
            case "surface":
                this.startFrame = (-64 * startFrame) + "px 0px";
                break;
        }
        this.endFrame = endFrame;
    };
    return AnimatedGameObject;
}(PassiveGameObject));
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    return Item;
}(AnimatedGameObject));
var Checkpoint = /** @class */ (function (_super) {
    __extends(Checkpoint, _super);
    function Checkpoint(checkpoint, newLevel, //supposed to name the level
    unityLevel, messageForKey, levelName) {
        var _this = _super.call(this) || this;
        _this.checkpoint = checkpoint;
        _this.newLevel = newLevel;
        _this.unityLevel = unityLevel;
        _this.messageForKey = messageForKey;
        _this.levelName = levelName;
        return _this;
    }
    return Checkpoint;
}(AnimatedGameObject));
var Teleport = /** @class */ (function (_super) {
    __extends(Teleport, _super);
    function Teleport(world, level, whyLocked, teleportAllowed) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.level = level;
        _this.whyLocked = whyLocked;
        _this.teleportAllowed = teleportAllowed;
        return _this;
    }
    return Teleport;
}(AnimatedGameObject));
var AnimatedMovementGameObject = /** @class */ (function (_super) {
    __extends(AnimatedMovementGameObject, _super);
    function AnimatedMovementGameObject(xend, yend, backToStartPoint) {
        if (xend === void 0) { xend = 0; }
        if (yend === void 0) { yend = 0; }
        if (backToStartPoint === void 0) { backToStartPoint = 0; }
        var _this = _super.call(this) || this;
        _this.xend = xend;
        _this.yend = yend;
        _this.backToStartPoint = backToStartPoint;
        return _this;
    }
    AnimatedMovementGameObject.prototype.setMovementProperties = function (xend, yend, backToStartPoint) {
        this.xend = xend;
        this.yend = yend;
        this.backToStartPoint = backToStartPoint;
    };
    return AnimatedMovementGameObject;
}(AnimatedGameObject));
var AnimatedHurtingGameObjectWithHealth = /** @class */ (function (_super) {
    __extends(AnimatedHurtingGameObjectWithHealth, _super);
    function AnimatedHurtingGameObjectWithHealth(maxHealth, currentHealth) {
        if (maxHealth === void 0) { maxHealth = 0; }
        if (currentHealth === void 0) { currentHealth = 0; }
        var _this = _super.call(this) || this;
        _this.maxHealth = maxHealth;
        _this.currentHealth = currentHealth;
        return _this;
    }
    AnimatedHurtingGameObjectWithHealth.prototype.setHealth = function (maxHealth, currentHealth) {
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
    };
    return AnimatedHurtingGameObjectWithHealth;
}(AnimatedMovementGameObject));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(hurt, fly) {
        var _this = _super.call(this) || this;
        _this.hurt = hurt;
        _this.fly = fly;
        return _this;
    }
    return Enemy;
}(AnimatedHurtingGameObjectWithHealth));
var Surface = /** @class */ (function (_super) {
    __extends(Surface, _super);
    function Surface(fan, surfaceAnimationCollection) {
        var _this = _super.call(this) || this;
        _this.fan = fan;
        _this.surfaceAnimationCollection = surfaceAnimationCollection;
        return _this;
    }
    Surface.prototype.setSurfaceCollisionProperties = function () {
        this.minx = this.x;
        this.miny = this.y;
        this.maxx = this.x + this.widthX;
        this.maxy = this.y + this.heightY;
    };
    return Surface;
}(AnimatedHurtingGameObjectWithHealth));
var FollowMeDefinition = /** @class */ (function () {
    function FollowMeDefinition(Enemies, Weapons, Items, Surfaces, Checkpoints, Teleports, Caves, Players) {
        if (Enemies === void 0) { Enemies = new Array(); }
        if (Weapons === void 0) { Weapons = new Array(); }
        if (Items === void 0) { Items = new Array(); }
        if (Surfaces === void 0) { Surfaces = new Array(); }
        if (Checkpoints === void 0) { Checkpoints = new Array(); }
        if (Teleports === void 0) { Teleports = new Array(); }
        if (Caves === void 0) { Caves = new Array(); }
        if (Players === void 0) { Players = new Array(); }
        this.Enemies = Enemies;
        this.Weapons = Weapons;
        this.Items = Items;
        this.Surfaces = Surfaces;
        this.Checkpoints = Checkpoints;
        this.Teleports = Teleports;
        this.Caves = Caves;
        this.Players = Players;
    }
    FollowMeDefinition.prototype.addEnemy = function (enemy) { this.Enemies[enemy._id] = enemy; };
    FollowMeDefinition.prototype.addWeapon = function (weapon) { this.Weapons[weapon._id] = weapon; };
    FollowMeDefinition.prototype.addItem = function (item) { this.Items[item._id] = item; };
    FollowMeDefinition.prototype.addSurface = function (surface) { this.Surfaces[surface._id] = surface; };
    FollowMeDefinition.prototype.addCheckpoint = function (checkpoint) { this.Checkpoints[checkpoint._id] = checkpoint; };
    FollowMeDefinition.prototype.addTeleport = function (teleport) { this.Teleports[teleport._id] = teleport; };
    FollowMeDefinition.prototype.addCave = function (cave) { this.Caves[cave._id] = cave; };
    FollowMeDefinition.prototype.addPlayer = function (player) { this.Players[player._id] = player; };
    FollowMeDefinition.prototype.getEnemies = function () { return this.Enemies; };
    FollowMeDefinition.prototype.getWeapons = function () { return this.Weapons; };
    FollowMeDefinition.prototype.getItems = function () { return this.Items; };
    FollowMeDefinition.prototype.getSurfaces = function () { return this.Surfaces; };
    FollowMeDefinition.prototype.getCheckpoints = function () { return this.Checkpoints; };
    FollowMeDefinition.prototype.getTeleports = function () { return this.Teleports; };
    FollowMeDefinition.prototype.getCaves = function () { return this.Caves; };
    FollowMeDefinition.prototype.getPlayer = function () { return this.Players.filter(function (m) { return m.local == true; }); };
    FollowMeDefinition.prototype.getOnlinePlayers = function () { return this.Players.filter(function (m) { return m.local == true; }); };
    return FollowMeDefinition;
}());
//# sourceMappingURL=declareClasses.js.map