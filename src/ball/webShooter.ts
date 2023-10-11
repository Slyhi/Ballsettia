/*unfinished*/
namespace Balls {
    export class WebShooter extends Ball {
        getName() { return 'Web Shooter'; }
        getDesc() { return `Shoots 3 spider webs every ${this.currentShootTime}s that will slows enemies by [lb]${this.slowFactorPercent}%[/lb] for [lb]${this.slowTime}s[/lb], leaves a web lasting [lb]${this.webLife}s[/lb] when the web hit the wall`; }
        getShopDmg() { return 1; }
        getShopHp() { return 3; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get slowFactorPercent() { return 50; }
        get slowFactor() { return this.slowFactorPercent/100; }
        get webLife() { return 13 + this.level*2; }
        get slowTime() { return 0.5 + this.level/2; }
        get webSpeed() { return 200; }

        private shootTime: number;
        private currentShootTime: number;

        constructor(config: Ball.Config) {
            super('balls/webshooter', 8, config);

            this.shootTime = Ball.Random.float(0.5, 1);
            this.currentShootTime = 0.75;

            this.addAbility('update', WebShooter.update);
        }

        private static update(source: WebShooter, world: World) {
            if (source.state !== Ball.States.BATTLE) return;
            
            source.shootTime += source.delta;
            while (source.shootTime >= source.currentShootTime) {
                WebShooter.shootWeb(source, world);
                source.shootTime -= source.currentShootTime;
            }
        }

        private static shootWeb(source: WebShooter, world: World) {
            let enemyBalls = getEnemies(world, source);
            if (enemyBalls.length === 0) return;
            let target = M.argmin(enemyBalls, ball => G.distance(source, ball));

            let offsetAngle = Ball.Random.int(10, 45);
            for (let angleOffset of [-offsetAngle, 0, offsetAngle]) {
                let angle = M.mod(M.atan2(target.y - source.y, target.x - source.x) + angleOffset, 360);

                let d = Vector2.fromPolar(1, angle);
                let v = d.withMagnitude(source.webSpeed);

                world.addWorldObject(new WebBullet(source.x + 10*d.x, source.y + 10*d.y, v, source, source.slowFactor, source.slowTime, source.webLife));
            }
            world.playSound('shoot', { humanized: false }).speed = Random.float(0.95, 1.05);
            source.didShootProjectile(3);
        }
    }
}