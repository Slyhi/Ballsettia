/*unfinished*/
namespace Balls {
    export class WebShooter extends Ball {
        getName() { return 'Web Shooter'; }
        getDesc() { return `Shoots the closest enemy a spider web every [lb]${this.shootPeriod}s[/lb] (max 0.1s)`; }
        getShopDmg() { return 1; }
        getShopHp() { return 3; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get shootPeriod() { return Math.max(1 - 0.1*this.level, 0.1); }

        constructor(config: Ball.Config) {
            super('balls/webshooter', 8, config);

            this.addAbility('onStartShop', Powerball.onStartShop);
        }

        static onStartShop(source: Ball, world: World) {
            addStartShopEffect({
                type: 'gold',
                sourceSquadIndex: source.squadIndexReference,
                gold: Powerball.getGoldGain(source),
            });
        }
    }
}