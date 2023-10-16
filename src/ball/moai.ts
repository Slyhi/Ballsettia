namespace Balls {
    export class Moai extends Ball {
        getName() { return 'Moai'; }
        getDesc() { return `On collide with enemy, gain damage reduction on hit by [r]${this.dmgReductionPerHit}<sword>[/r] (cannot decrease damage below 0.75)`; }
        getShopDmg() { return 3; }
        getShopHp() { return 7; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get dmgReductionPerHit() { return this.level*0.5; }

        private cooldown: AbilityCooldown;
        private dmgReduction: number;

        constructor(config: Ball.Config) {
            super('balls/moai', 8, config);

            this.cooldown = new AbilityCooldown(1, 2);
            this.dmgReduction = 0;

            this.addAbility('onCollideWithEnemyPostDamage', Moai.onCollideWithEnemyPostDamage, { canActivateTwice: false });
            this.addAbility('update', Moai.update);
        }

        private static onCollideWithEnemyPostDamage(source: Moai, world: World, collideWith: Ball, damage: number) {
            if (!source.cooldown.consumeUse()) return;
            source.dmgReduction += source.dmgReductionPerHit;
            if (source.shouldActivateAbilityTwice()) {
                source.dmgReduction += source.dmgReductionPerHit;
            }
        }

        private static update(source: Moai, world: World) {
            if (source.state !== Ball.States.BATTLE && source.state !== Ball.States.PRE_BATTLE) return;
            source.addProtected(source, source.dmgReduction, 0.1);
        }
    }
}