/*unfinished*/
namespace Balls {
    export class Moai extends Ball {
        getName() { return 'Moai'; }
        getDesc() { return `On hit with balls, change direction of hitted ball and slow them`; }
        getShopDmg() { return 1; }
        getShopHp() { return 4; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(config: Ball.Config) {
            super('balls/moai', 8, config);

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