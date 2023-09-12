/*unfinished*/
/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class ShootingStar extends OrbitEquipment {
        getName() { return 'Shooting Star'; }
        getDesc() {
            return `At the start of battle, shrink thHe equipped ball and nearby allies to half of their size`;
        }

        constructor() {
            super('equipments/shootingstar', 'items/shootingstar');

            this.addAbility('onEquip', ShootingStar.onEquip);
            this.addAbility('onDeath', ShootingStar.onDeath);
        }

        private static onEquip(equipment: ShootingStar, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE && source.state !== Ball.States.BATTLE) return;
            source.buff(0, 1);
        }

        private static onDeath(equipment: ShootingStar, source: Ball, world: World, killedBy: Ball): void {
            if (source.team !== 'friend') return;
            if (!youArePlaying(world)) return;
            if (source.squadIndexReference < 0) return;
            if (hasStartShopEffect('buff', source.squadIndexReference)) return;

            addStartShopEffect({
                type: 'buff',
                sourceSquadIndex: source.squadIndexReference,
                health: 1,
                damage: 0,
            });
        }
    }
}