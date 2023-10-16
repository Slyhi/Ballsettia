namespace Balls {
    export class BallOfCotton extends Ball {
        getName() { return 'Ball of Cotton'; }
        getDesc() { return `On collision with the wall, heal a random ally for [g]${this.healAmount}<heart>[/g]`; }
        getShopDmg() { return 2; }
        getShopHp() { return 5; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get healAmount() { return 0.5*this.level; }

        private cooldown: AbilityCooldown;
        private hitToken: number;

        constructor(config: Ball.Config) {
            super('balls/cottonball', 8, config);

            this.cooldown = new AbilityCooldown(1, 2); // in 1 second it can only use its ability 2 times
            this.hitToken = 0;

            this.addAbility('update', BallOfCotton.update);
        }

        update(): void {
            super.update();
            this.cooldown.update(this.delta);
        }
        
        onCollide(collision: Physics.Collision): void {
            super.onCollide(collision);
            if (this.state === Ball.States.BATTLE && collision.other.obj.physicsGroup === Battle.PhysicsGroups.walls && this.cooldown.consumeUse() && !this.isNullified()) {
                this.hitToken++;
                if (this.shouldActivateAbilityTwice()) {
                    this.doAfterTime(0.1, () => this.hitToken++);
                }
            }
        }

        private static update(source: BallOfCotton, world: World): void {
            if (source.state !== Ball.States.BATTLE) return;
            while (source.hitToken >= 1) {
                source.hitToken--;

                let validBalls = getAlliesNotSelf(world, source);
                if (validBalls.length === 0) return;
                validBalls = getMutableSelect(world, source, validBalls);

                let randomBall = Ball.Random.element(validBalls);
                world.addWorldObject(new HomingHeal(source.x, source.y, source, randomBall, source.healAmount, balls => undefined));
            }
        }
    }
}