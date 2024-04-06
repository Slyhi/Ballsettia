namespace Balls {
    export class Wintermelon extends Ball {
        getName() { return this.displayedName; }
        getDesc() { return `On collisions [fb]chill[/fb] nearby enemies for [lb]${this.chillTime}s[/lb]`; }
        getShopDmg() { return 0; }
        getShopHp() { return 4; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get chillTime() { return 1 + this.level; }
        get splashRadius() { return this.physicalRadius + 28; }

        private displayedName: string;
        private cooldown: Timer;

        constructor(config: Ball.Config) {
            super('balls/wintermelon', 8, config);
            this.angle = 90;

            this.displayedName = Random.boolean(0.9) ? 'Wintermelon' : 'Minterwelon';

            this.cooldown = this.addTimer(0.1);
            this.cooldown.finish();

            this.addAbility('onCollideWithEnemyPostDamage', Wintermelon.onCollideWithEnemyPostDamage, { canActivateTwice: false });
        }

        private static onCollideWithEnemyPostDamage(source: Wintermelon, world: World, collideWith: Ball, damage: number) {
            if (!source.cooldown.done) return;

            Wintermelon.splash(source, world);
            if (source.shouldActivateAbilityTwice()) {
                source.doAfterTime(0.3, () => Wintermelon.splash(source, world));
            }
            source.cooldown.reset();
        }

        private static splash(source: Wintermelon, world: World) {
            world.addWorldObject(new StarExplosion(source.x, source.y, { damage: source.splashRadius, inner: source.splashRadius*0.84, outer: source.splashRadius*1.16 }, { ally: 0, enemy: 0 }, source, 6));

            let enemyBalls = getEnemies(world, source).filter(enemy => G.distance(source, enemy) < source.splashRadius + enemy.physicalRadius);
            if (enemyBalls.length !== 0) {
                for (let ball of enemyBalls) {
                    ball.addChilling(source, source.chillTime);
                }
            }
            world.playSound('splash');
        }
    }
}