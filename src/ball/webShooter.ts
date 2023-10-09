/*unfinished*/
namespace Balls {
    export class WebShooter extends Ball {
        getName() { return 'Web Shooter'; }
        getDesc() { return `Shoots the closest enemy 3 spider webs every 0.75s that will slows enemies by [lb]${this.slowFactorPercent}%[/lb] for [lb]${this.slowTime}s[/lb], leaves a web lasting [lb]${this.webLife}s[/lb] when the web hit the wall`; }
        getShopDmg() { return 1; }
        getShopHp() { return 3; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get slowFactorPercent() { return 50; }
        get slowFactor() { return this.slowFactorPercent/100; }
        get webLife() { return 13 + this.level*2; }
        get slowTime() { return 0.5 + this.level/2; }
        get webSpeed() { return 200; }

        private shootTime: number;

        constructor(config: Ball.Config) {
            super('balls/webshooter', 8, config);

            this.shootTime = Ball.Random.float(0.5, 1);

            this.addAbility('update', WebShooter.update);
        }

        private static update(source: WebShooter, world: World) {
            if (source.state !== Ball.States.BATTLE) return;
            let enemyBalls = getEnemies(world, source);
            if (enemyBalls.length === 0) return;
            let target = M.argmin(enemyBalls, ball => G.distance(source, ball));

            source.shootTime += source.delta;
            while (source.shootTime >= 0.75) {
                WebShooter.shootWeb(source, target, world);
                source.shootTime -= 0.75;
            }
        }

        private static shootWeb(source: WebShooter, target: Ball, world: World) {
            let offsetAngle = Ball.Random.int(10, 30);
            let webV = target.getPosition().subtract(source).setMagnitude(source.webSpeed);
            for (let angleOffset of [-offsetAngle, 0, offsetAngle]) {
                world.addWorldObject(new WebBullet(source.x, source.y, webV.rotated(M.mod(webV.angle + angleOffset, 360)), source, source.slowFactor, source.slowTime, source.webLife));
            }
            world.playSound('shoot', { humanized: false }).speed = Random.float(0.95, 1.05);
            source.didShootProjectile(3);
        }
    }
}