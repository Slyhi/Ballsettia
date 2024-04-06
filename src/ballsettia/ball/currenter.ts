namespace Balls {
    export class Currenter extends Ball {
        getName() { return 'Currenter'; }
        getDesc() { return `Moves at 200% speed and zap nearby enemies for [r]1<sword>/s[/r] for [lb]${this.chargeTime}s[/lb]`; }
        getShopDmg() { return 7; }
        getShopHp() { return 3; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get chargeTime() { return 2 + 2*this.level; }

        private zapTail: ZapTail;

        constructor(config: Ball.Config) {
            super('balls/currenter', 8, config);

            this.addAbility('onEnterBattle', Currenter.onEnterBattle, { nullifyable: false });
        }

        private static onEnterBattle(source: Currenter, world: World) {
            source.runScript(function*() {
                yield S.doOverTime(10, t => {
                    if (!source.isNullified()) {
                        source.addBurning(source, 0.1);
                        source.addBoostMaxSpeed(source, 'other', 2, 2, 1);
                        source.addScaleAcceleration(source, 2, 0.1);
                    }
                });
            });
        }
    }
}