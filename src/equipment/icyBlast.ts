/*unfinished, editing*/
/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class IcyBlast extends OrbitEquipment {
        getName() { return 'Icy Blast'; }
        getDesc() {
            return `At the start of battle, shrink thHe equipped ball and nearby allies to half of their size`;
        }

        constructor() {
            super('equipments/icyblast', 'items/icyblast');

            this.addAbility('onEquip', IcyBlast.onEquip);
            this.addAbility('onDeath', IcyBlast.onDeath);
        }

        //let visibleFreezeRadius = 28
        //let vertices = G.generateStarVertices(x, y, this.visibleFreezeRadius, this.visibleFreezeRadius*1.32, 12); // oR=37, iR=28
        //Draw.polygonOutline(texture, vertices);
        //Draw.polygonSolid(texture, vertices);

        private static onEquip(equipment: IcyBlast, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE && source.state !== Ball.States.BATTLE) return;
            source.buff(0, 1);
            //source.v.normalize
            //source.v.normalized
        }

        private static onDeath(equipment: IcyBlast, source: Ball, world: World, killedBy: Ball): void {
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
