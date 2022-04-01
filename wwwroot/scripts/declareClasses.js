/*
index and uniqueIdentifier to be removed, in place of server-side systemId
xMove replaced by maxx
yMove replaced my maxy
*/
class GameObject {
    constructor() {
        this.systemId = 0;
        this.x = 0;
        this.y = 0;
        this.imageName = "";
    }
}
class Player extends GameObject {
    constructor(health, maxHealth, lives, username, local) {
        super();
        this.health = health;
        this.maxHealth = maxHealth;
        this.lives = lives;
        this.username = username;
        this.local = local;
    }
}
class PassiveGameObject extends GameObject {
    constructor() {
        super();
        this.widthX = 64;
        this.heightY = 64;
        this.hideMinimumDifficulty = 0;
        this.showMinimumDifficulty = 0;
        this.caveName = "";
        this.inCave = false;
        this.spriteY = 0;
        this.imageName = "";
    }
    setPassiveObjectProperties(type, systemId, x, y, caveName, hideMinimumDifficulty, showMinimumDifficulty, spriteY, width, height, imageName) {
        this.hideMinimumDifficulty = hideMinimumDifficulty;
        this.showMinimumDifficulty = showMinimumDifficulty;
        this.systemId = systemId;
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
        this.imageName = imageName;
    }
    getCaveDetails() {
        console.log(this.caveName.length > 0 ? this.caveName + ", in cave? " + this.inCave : "[no cave]");
    }
}
class Weapon extends PassiveGameObject {
    constructor(hurt, rate, weaponLevel) {
        super();
        this.hurt = hurt;
        this.rate = rate;
        this.weaponLevel = weaponLevel;
    }
    ;
}
;
class Cave extends PassiveGameObject {
    constructor(entrance, caveWall, caveCeiling, xMove, //image manipulations
    yMove) {
        super();
        this.entrance = entrance;
        this.caveWall = caveWall;
        this.caveCeiling = caveCeiling;
        this.xMove = xMove;
        this.yMove = yMove;
    }
    ;
}
;
class AnimatedGameObject extends PassiveGameObject {
    constructor(animate = false, startFrame = "", endFrame = 0) {
        super();
        this.animate = animate;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
    }
    giveAnimate() {
        console.log(this.animate);
    }
    setAnimationProperties(animate, startFrame, endFrame, type) {
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
    }
}
class Item extends AnimatedGameObject {
    constructor(message) {
        super();
        this.message = message;
    }
}
class Checkpoint extends AnimatedGameObject {
    constructor(checkpoint, newLevel, //supposed to name the level
    unityLevel, messageForKey, levelName) {
        super();
        this.checkpoint = checkpoint;
        this.newLevel = newLevel;
        this.unityLevel = unityLevel;
        this.messageForKey = messageForKey;
        this.levelName = levelName;
    }
}
class Teleport extends AnimatedGameObject {
    constructor(world, level, whyLocked, teleportAllowed) {
        super();
        this.world = world;
        this.level = level;
        this.whyLocked = whyLocked;
        this.teleportAllowed = teleportAllowed;
    }
}
class AnimatedMovementGameObject extends AnimatedGameObject {
    constructor(xend = 0, yend = 0, backToStartPoint = 0) {
        super();
        this.xend = xend;
        this.yend = yend;
        this.backToStartPoint = backToStartPoint;
    }
    setMovementProperties(xend, yend, backToStartPoint) {
        this.xend = xend;
        this.yend = yend;
        this.backToStartPoint = backToStartPoint;
    }
}
class AnimatedHurtingGameObjectWithHealth extends AnimatedMovementGameObject {
    constructor(maxHealth = 0, currentHealth = 0) {
        super();
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
    }
    setHealth(maxHealth, currentHealth) {
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
    }
}
class Enemy extends AnimatedHurtingGameObjectWithHealth {
    constructor(hurt, fly) {
        super();
        this.hurt = hurt;
        this.fly = fly;
    }
}
class Surface extends AnimatedHurtingGameObjectWithHealth {
    constructor(fan, surfaceAnimationCollection) {
        super();
        this.fan = fan;
        this.surfaceAnimationCollection = surfaceAnimationCollection;
    }
    setSurfaceCollisionProperties() {
        this.minx = this.x;
        this.miny = this.y;
        this.maxx = this.x + this.widthX;
        this.maxy = this.y + this.heightY;
    }
}
class FollowMeDefinition {
    constructor(Enemies = new Array(), Weapons = new Array(), Items = new Array(), Surfaces = new Array(), Checkpoints = new Array(), Teleports = new Array(), Caves = new Array(), Players = new Array()) {
        this.Enemies = Enemies;
        this.Weapons = Weapons;
        this.Items = Items;
        this.Surfaces = Surfaces;
        this.Checkpoints = Checkpoints;
        this.Teleports = Teleports;
        this.Caves = Caves;
        this.Players = Players;
    }
    addEnemy(enemy) { this.Enemies[enemy.systemId] = enemy; }
    addWeapon(weapon) { this.Weapons[weapon.systemId] = weapon; }
    addItem(item) { this.Items[item.systemId] = item; }
    addSurface(surface) { this.Surfaces[surface.systemId] = surface; }
    addCheckpoint(checkpoint) { this.Checkpoints[checkpoint.systemId] = checkpoint; }
    addTeleport(teleport) { this.Teleports[teleport.systemId] = teleport; }
    addCave(cave) { this.Caves[cave.systemId] = cave; }
    addPlayer(player) { this.Players[player.systemId] = player; }
    getCaves() { return this.Caves; }
    getCheckpoints() { return this.Checkpoints; }
    getCheckpoint(systemId) { return this.Checkpoints.filter(m => m.systemId == systemId); }
    getCheckpointByCheckpointId(checkpoint) { return this.Checkpoints.filter(m => m.checkpoint == checkpoint); }
    getEnemies() { return this.Enemies; }
    getEnemy(systemId) { return this.Enemies.filter(m => m.systemId == systemId); }
    getOnlinePlayers() { return this.Players.filter(m => m.local == true); }
    getPlayer() { return this.Players.filter(m => m.local == true); }
    getItems() { return this.Items; }
    getWeapons() { return this.Weapons; }
    getSurfaces() { return this.Surfaces; }
    getSurface(systemId) { return this.Surfaces.filter(m => m.systemId == systemId); }
    getTeleports() { return this.Teleports; }
}
//# sourceMappingURL=declareClasses.js.map