/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class DFour extends OrbitEquipment {
        getName() { return 'd4'; }
        getDesc() {
            let PLAY = `${GAME_MODE === 'vs' || GAME_MODE === 'spectate' ? 'LOCK IN' : 'PLAY'}`;
            return `On ${PLAY}, permanently gain/lose status from ${buffText(-2, -2)} to ${buffText(2, 2)} randomly`;
        }

        constructor() {
            super('equipments/dfour/4', 'items/dfour');

            this.addAbility('onPlay', DFour.onPlay);
        }

        private static onPlay(equipment: DFour, source: Ball, world: World) {
            const dieFaceToBuff = { 1: -2, 2: -1, 3: 1, 4: 2 };
            let dieFace = Math.ceil(Math.random()*4);
            equipment.orbitingIcon.setTexture('equipments/dfour/' + dieFace);
            let buffAmount = dieFaceToBuff[dieFace];
            source.buff(source.dmg >= -buffAmount ? buffAmount : -source.dmg, source.hp >= -buffAmount ? buffAmount : -source.hp);
            FIND_OPPONENT_WAIT_TIME = Math.max(FIND_OPPONENT_WAIT_TIME, 2);
        }
    }
}
