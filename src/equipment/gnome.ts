/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class Gnome extends OrbitEquipment {
        getName() { return 'Gnome'; }
        getDesc() { return `Grows two times as it rolls for ${this.totalTimeToGain} seconds`; }

        get totalTimeToGain() { return 20; }

        constructor() {
            super('equipments/gnome', 'items/gnome');

            this.addAbility('update', Gnome.update);
        }

        private static update(equipment: Gnome, source: Ball, world: World) {
            if (source.state !== Ball.States.BATTLE) return;
            let INITIAL_SCALE = 0.5;
            let MAX_SCALE = 1;
            
            let growthRate = (MAX_SCALE - INITIAL_SCALE) / equipment.totalTimeToGain;

            let newBallScale = Math.min(source.ballScale + growthRate*source.delta, MAX_SCALE);

            source.setBallScale(newBallScale);
        }
    }
}