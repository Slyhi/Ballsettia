/*unfinished*/
namespace Balls {
    export class Winder extends Ball {
        getName() { return 'Winder'; }
        getDesc() { return `Every ${this.shootTime} seconds shoot a tornado that can pull enemy ball and deal [r]${this.tornadoDmg}<sword>/s[/r]1+0.5★dmg/s. Tornado can last 2s`; }
        getShopDmg() { return 6; }
        getShopHp() { return 9; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get shootTime() { return 3; }
        get tornadoDmg() { return 1 + 0.5*this.level; }

        constructor(config: Ball.Config) {
            super('balls/winder', 8, config);

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