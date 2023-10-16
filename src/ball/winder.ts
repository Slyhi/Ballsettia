namespace Balls {
    export class Winder extends Ball {
        getName() { return 'Winder'; }
        getDesc() { return `Every ${this.currentShootTime}s shoot a tornado that can pull enemy toward it with [lb]${this.enemyEffectivenessPercent}%[/lb] force ball and deal [r]${this.tornadoDps}<sword>/s[/r]\n\nThe tornado last for ${this.windLife}s`; }
        getShopDmg() { return 2; }
        getShopHp() { return 8; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get currentShootTime() { return 5; }
        get enemyEffectivenessPercent() { return 100 + 10*(this.level-1); }
        get enemyEffectiveness() { return this.enemyEffectivenessPercent/100; }
        get tornadoDps() { return 0.5 + 0.5*this.level; }
        get windLife() { return 3; }
        get windSpeed() { return 30; }

        private shootTime: number;

        constructor(config: Ball.Config) {
            super('balls/winder', 8, config);

            this.shootTime = Ball.Random.float(2.5, 5);

            this.addAbility('update', Winder.update);
        }

        private static update(source: Winder, world: World) {
            if (source.state !== Ball.States.BATTLE) return;
            
            source.shootTime += source.delta;
            while (source.shootTime >= source.currentShootTime) {
                Winder.shoot(source, world);
                if (source.shouldActivateAbilityTwice()) {
                    source.doAfterTime(source.currentShootTime/2, () => Winder.shoot(source, world));
                }
                source.shootTime -= source.currentShootTime;
            }
        }

        private static shoot(source: Winder, world: World) {
            let enemyBalls = getEnemies(world, source);
            enemyBalls = getMutableSelect(world, source, enemyBalls);
            if (enemyBalls.length === 0) return;
            let target = M.argmin(enemyBalls, ball => G.distance(source, ball));

            let angle = M.mod(M.atan2(target.y - source.y, target.x - source.x), 360);

            let d = Vector2.fromPolar(1, angle);
            let v = d.withMagnitude(source.windSpeed);

            world.addWorldObject(new Cyclone(source.x + 10*d.x, source.y + 10*d.y, v, source, source.radius*1.5, source.tornadoDps, source.enemyEffectiveness, source.windLife, false));
            world.playSound('shoot', { humanized: false }).speed = Random.float(0.95, 1.05);
            source.didShootProjectile(1);
        }
    }
}