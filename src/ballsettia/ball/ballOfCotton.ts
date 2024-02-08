namespace Balls {
    export class BallOfCotton extends Ball {
        getName() { return 'Ball of Cotton'; }
        getDesc() { return `On collision with the wall, heal a random ally for [g]${this.healAmount}<heart>[/g]`; }
        getShopDmg() { return 2; }
        getShopHp() { return 5; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get healAmount() { return 0.5*this.level; }

        private cooldown: AbilityCooldown;

        constructor(config: Ball.Config) {
            super('balls/cottonball', 8, config);

            this.cooldown = new AbilityCooldown(0.5, 1); // in 0.5 second it can only use its ability 1 times

            this.addAbility('onHitWall', BallOfCotton.onHitWall);
        }

        update(): void {
            super.update();
            this.cooldown.update(this.delta);
        }

        private static onHitWall(source: BallOfCotton, world: World): void {
            BallOfCotton.giveHeal(source, world);
            if (source.shouldActivateAbilityTwice()) {
                source.doAfterTime(0.1, () => BallOfCotton.giveHeal(source, world));
            }
        }

        private static giveHeal(source: BallOfCotton, world: World): void {
            let validBalls = getAlliesNotSelf(world, source);
            if (validBalls.length === 0) return;
            validBalls = getMutableSelect(source, validBalls);

            let randomBall = Ball.Random.element(validBalls);
            world.addWorldObject(new HomingHeal(source.x, source.y, source, randomBall, source.healAmount, validBalls => Ball.Random.element(validBalls)));
        }
    }
}