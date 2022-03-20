///   <reference path="declareClasses.ts"/>

function typeScriptFile() {
    console.log("typeScripthit")
}

let gameProperties = new FollowMeDefinition();

function getObjectsByType(type: string) {
    switch (type.toUpperCase()) {
        case "SURFACE":
            return gameProperties.getSurfaces();
        case "ENEMIES":
            return gameProperties.getEnemies();
        case "WEAPON":
            return gameProperties.getWeapons();
        case "ITEM":
            return gameProperties.getItems();
        case "CHECKPOINT":
            return gameProperties.getCheckpoints();
        case "TELEPORT":
            return gameProperties.getTeleports();
        case "CAVE":
            return gameProperties.getCaves();
    }
}

function getCheckpointByPlayerCheckpoint(identifier: number) {
    return gameProperties.getCheckpoints().filter(m => m.checkpoint == identifier)[0];
}

function addGameObject(ObjIncoming) {

    switch (ObjIncoming.type)
    {
        case "surface":
            let newSurface = new Surface(ObjIncoming.fan, ObjIncoming.surfaceAnimationCollection);
            newSurface.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            newSurface.setAnimationProperties(ObjIncoming.animate, ObjIncoming.startFrame, ObjIncoming.endFrame, ObjIncoming.type);
            newSurface.setMovementProperties(ObjIncoming.xend, ObjIncoming.yend, ObjIncoming.backToStartPoint);
            newSurface.setSurfaceCollisionProperties();
            newSurface.setHealth(ObjIncoming.maxHealth, ObjIncoming.currentHealth);
            gameProperties.addSurface(newSurface);
            break;
        case "Item":
            let newItem = new Item(ObjIncoming.message);
            newItem.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            newItem.setAnimationProperties(ObjIncoming.animate, ObjIncoming.startFrame, ObjIncoming.endFrame, ObjIncoming.type);
            gameProperties.addItem(newItem);
            break;
        case "Weapon":
            let newWeapon = new Weapon(ObjIncoming.hurt, ObjIncoming.rate, ObjIncoming.weaponLevel);
            newWeapon.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            gameProperties.addWeapon(newWeapon);
            break;
        case "checkpoint":
            let newCheckpoint = new Checkpoint(ObjIncoming.checkpoint, ObjIncoming.newLevel, 1, ObjIncoming.messageForKey, ObjIncoming.levelName);
            newCheckpoint.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            newCheckpoint.setAnimationProperties(ObjIncoming.animate, ObjIncoming.startFrame, ObjIncoming.endFrame, ObjIncoming.type);
            gameProperties.addCheckpoint(newCheckpoint);
            break;
        case "Teleport":
            let newTeleport = new Teleport(ObjIncoming.world, ObjIncoming.level, ObjIncoming.whyLocked, ObjIncoming.teleportAllowed);
            newTeleport.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            newTeleport.setAnimationProperties(ObjIncoming.animate, ObjIncoming.startFrame, ObjIncoming.endFrame, ObjIncoming.type);
            gameProperties.addTeleport(newTeleport);
            break;
        case "Cave":
            let newCave = new Cave(ObjIncoming.entrance, ObjIncoming.caveWall, ObjIncoming.caveCeiling, ObjIncoming.xMove, ObjIncoming.yMove);
            newCave.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            gameProperties.addCave(newCave);
            break;
        case "enemies":
            let newEnemy = new Enemy(ObjIncoming.hurt, ObjIncoming.fly);
            newEnemy.setPassiveObjectProperties(ObjIncoming.type, ObjIncoming._id, ObjIncoming.x, ObjIncoming.y, ObjIncoming.caveName, ObjIncoming.hideMinimumDifficulty, ObjIncoming.showMinimumDifficulty, ObjIncoming.spriteY, ObjIncoming.widthX, ObjIncoming.heightY);
            newEnemy.setMovementProperties(ObjIncoming.xend, ObjIncoming.yend, ObjIncoming.backToStartPoint);
            newEnemy.setHealth(ObjIncoming.maxHealth, ObjIncoming.maxHealth);
            newEnemy.setAnimationProperties(ObjIncoming.animate, ObjIncoming.startFrame, ObjIncoming.endFrame, ObjIncoming.type);
            gameProperties.addEnemy(newEnemy);
            break;
    }    
};