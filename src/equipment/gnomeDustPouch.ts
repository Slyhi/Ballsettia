/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class GnomeDustPouch extends OrbitEquipment {
        getName() { return 'Gnome Dust Pouch'; }
        getDesc() { return `At the start of battle, shrink the equipped ball and nearby allies to half of their size`; }

        get shrinkRadius() { return 20 + (this.getParent()?.physicalRadius ?? 8)-8; }

        constructor() {
            super('equipments/gnomedustpouch', 'items/gnomedustpouch');

            this.preBattleAbilityInitialWaitTime = 0.5;

            this.addAbility('onPreBattle', GnomeDustPouch.onPreBattle);
            this.addAbility('onEnterBattle', GnomeDustPouch.onEnterBattle);
        }

        onAdd(): void {
            super.onAdd();
            this.addChild(new AbilityRadius(this.getParent(), () => this.shrinkRadius, 0x29ADFF, 0x2C99CC, 0.8));
        }

        private static onPreBattle(equipment: GnomeDustPouch, source: Ball, world: World) {
            GnomeDustPouch.shrinkBallsInRadius(equipment, source, world);
        }

        private static onEnterBattle(equipment: GnomeDustPouch, source: Ball, world: World) {
            GnomeDustPouch.shrinkBallsInRadius(equipment, source, world);
        }

        private static shrinkBallsInRadius(equipment: GnomeDustPouch, source: Ball, world: World) {
            let validBalls = getAllies(world, source).filter(ally => G.distance(source, ally) < equipment.shrinkRadius + ally.physicalRadius);
            if (validBalls.length === 0) return;

            for (let ball of validBalls) {
                ball.setBallScale(0.5);
                world.addWorldObject(newPuff(ball.x, ball.y, Battle.Layers.fx, 'small'));
            }

            world.playSound('debug', { limit: 2 });
            source.unequip();
        }
    }
}
