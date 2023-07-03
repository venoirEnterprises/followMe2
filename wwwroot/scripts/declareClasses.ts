/*
index and uniqueIdentifier to be removed, in place of server-side systemId
xMove replaced by maxx
yMove replaced my maxy
*/

abstract class GameObject {
    constructor(
    ) { }

    public systemId: number = 0
    public x: number = 0
    public y: number = 0
    public imageName: string = ''
}

class Player extends GameObject {
    constructor(
        public health: number,
        public maxHealth: number,
        public lives: number,
        public username: string,
        public local: boolean
    ) { super() }
}

abstract class PassiveGameObject extends GameObject {
    constructor(
    ) { super() }

    public imageSize = 16
    public widthX: number = this.imageSize
    public heightY: number = this.imageSize
    public hideMinimumDifficulty: number = 0
    public showMinimumDifficulty: number = 0
    public caveName: string = ''
    public inCave: boolean = false
    public spriteY: number = 0
    public imageName: string = ''

    setPassiveObjectProperties(type: string, systemId: number, x: number, y: number, caveName: string, hideMinimumDifficulty: number, showMinimumDifficulty: number, spriteY: number, width: number, height: number, imageName: string): void {
        this.hideMinimumDifficulty = hideMinimumDifficulty
        this.showMinimumDifficulty = showMinimumDifficulty
        this.systemId = systemId
        this.x = x * this.imageSize
        this.y = y * this.imageSize
        this.widthX = width * this.imageSize
        this.heightY = height * this.imageSize
        if (type === 'enemies') {
            this.heightY += 8
        }
        this.spriteY = spriteY
        this.caveName = caveName === null ? '' : caveName;
        this.inCave = this.caveName.length > 0
        this.imageName = imageName
    }

    getCaveDetails() {
        console.log(this.caveName.length > 0 ? this.caveName + ', in cave? ' + this.inCave : '[no cave]')
    }
}

class Weapon extends PassiveGameObject {
    constructor(
        public hurt: number,
        public rate: number,
        public weaponLevel: number
    ) {
        super()
    };
};

class Cave extends PassiveGameObject {
    constructor(
        public entrance: boolean,
        public caveWall: boolean,
        public caveCeiling: boolean,
        public xMove: number, // image manipulations
        public yMove: number
    ) {
        super()
    };
};

abstract class AnimatedGameObject extends PassiveGameObject {
    constructor(
        public animate: boolean = false,
        public startFrame: string = '',
        public endFrame: number = 0
    ) { super() }

    giveAnimate() {
        console.log(this.animate)
    }

    setAnimationProperties(animate: boolean, startFrame: number, endFrame: number, type: string) {
        this.animate = animate
        switch (type) {
            case 'checkpoint':
                this.startFrame = (-64 * startFrame) + 'px -64px'
                break
            case 'enemies':
                this.startFrame = (-64 * startFrame) + 'px -192px'
                break
            case 'surface':
                this.startFrame = (-64 * startFrame) + 'px 0px'
                break
        }
        this.endFrame = endFrame
    }
}

class Item extends AnimatedGameObject {
    constructor(
        public message: string
    ) { super() }
}

class Checkpoint extends AnimatedGameObject {
    constructor(
        public checkpoint: number,
        public newLevel: string, // supposed to name the level
        public unityLevel: number,
        public messageForKey: string,
        public levelName: string
    ) { super() }
}

class Teleport extends AnimatedGameObject {
    constructor(
        public world: string,
        public level: string,
        public whyLocked: string,
        public teleportAllowed: boolean
    ) { super() }
}

abstract class AnimatedMovementGameObject extends AnimatedGameObject {
    constructor(
        public xend: number = 0,
        public yend: number = 0,
        public backToStartPoint: number = 0
    ) { super() }

    setMovementProperties(xend: number, yend: number, backToStartPoint: number) {
        this.xend = xend
        this.yend = yend
        this.backToStartPoint = backToStartPoint
    }
}

abstract class AnimatedHurtingGameObjectWithHealth extends AnimatedMovementGameObject {
    constructor(
        public maxHealth: number = 0,
        public currentHealth: number = 0
    ) { super() }

    setHealth(maxHealth, currentHealth) {
        this.maxHealth = maxHealth
        this.currentHealth = currentHealth
    }
}

class Enemy extends AnimatedHurtingGameObjectWithHealth {
    constructor(
        public hurt: number,
        public fly: boolean
    ) {
        super()
    }
}

class Surface extends AnimatedHurtingGameObjectWithHealth {
    constructor(
        public fan: boolean,
        public surfaceAnimationCollection: string
    ) { super() }

    setSurfaceCollisionProperties() {
        this.minx = this.x
        this.miny = this.y
        this.maxx = this.x + this.widthX
        this.maxy = this.y + this.heightY
    }

    private minx: number
    private miny: number
    private maxx: number
    private maxy: number
}

class FollowMeDefinition {
    constructor(
        public Enemies: Enemy[] = new Array<Enemy>(),
        public Weapons: Weapon[] = new Array<Weapon>(),
        public Items: Item[] = new Array<Item>(),
        public Surfaces: Surface[] = new Array<Surface>(),
        public Checkpoints: Checkpoint[] = new Array<Checkpoint>(),
        public Teleports: Teleport[] = new Array<Teleport>(),
        public Caves: Cave[] = new Array<Cave>(),
        public Players: Player[] = new Array<Player>()
    ) { }

    addEnemy(enemy: Enemy) { this.Enemies[enemy.systemId] = enemy }
    addWeapon(weapon: Weapon) { this.Weapons[weapon.systemId] = weapon }
    addItem(item: Item) { this.Items[item.systemId] = item }
    addSurface(surface: Surface) { this.Surfaces[surface.systemId] = surface }
    addCheckpoint(checkpoint: Checkpoint) { this.Checkpoints[checkpoint.systemId] = checkpoint }
    addTeleport(teleport: Teleport) { this.Teleports[teleport.systemId] = teleport }
    addCave(cave: Cave) { this.Caves[cave.systemId] = cave }
    addPlayer(player: Player) { this.Players[player.systemId] = player }
    getCaves() { return this.Caves }
    getCheckpoints() { return this.Checkpoints }
    getCheckpoint(systemId: number) { return this.Checkpoints.filter(m => m.systemId == systemId) }
    getCheckpointByCheckpointId(checkpoint: number) { return this.Checkpoints.filter(m => m.checkpoint == checkpoint) }
    getEnemies() { return this.Enemies }
    getEnemy(systemId: number) { return this.Enemies.filter(m => m.systemId == systemId) }
    getOnlinePlayers() { return this.Players.filter(m => m.local) }
    getPlayer() { return this.Players.filter(m => m.local) }
    getItems() { return this.Items }
    getWeapons() { return this.Weapons }
    getSurfaces() { return this.Surfaces }
    getSurface(systemId: number) { return this.Surfaces.filter(m => m.systemId == systemId) }
    getTeleports() { return this.Teleports }
}
