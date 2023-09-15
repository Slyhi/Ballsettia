/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class DFour extends OrbitEquipment {
        getName() { return 'd4'; }
        getDesc() {
            let PLAY = `${GAME_MODE === 'vs' || GAME_MODE === 'spectate' ? 'LOCK IN' : 'PLAY'}`;
            return `On ${PLAY}, take [gold]<coin>${this.goldRequirement} unspent[/gold] to permanently permanently gain status from [r]2<sword>[/r], [g]2<heart>[/g], [gold]1<star>[/gold], or gain [gold]<coin>6[/gold] next round randomly`;
        }

        get goldRequirement() { return 5; }

        constructor() {
            super('equipments/dfour/0', 'items/dfour');

            this.orbitingIcon.addAnimation(Animations.fromTextureList({ name: 'dfour', textureRoot: 'equipments/dfour',
                textures: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                frameRate: 8, count: Infinity }));
            this.orbitingIcon.playAnimation('dfour');
            
            this.addAbility('onPlay', DFour.onPlay);
        }

        private static onPlay(equipment: DFour, source: Ball, world: World) {
            if (GAME_DATA.gold < equipment.goldRequirement) return;
            GAME_DATA.gold -= equipment.goldRequirement;
            animateGiveOrTakeShopGold(world, source, -equipment.goldRequirement);

            let dieFace: number = Ball.Random.int(1, 4);

            if (dieFace === 1) {
                equipment.orbitingIcon.addAnimation(Animations.fromTextureList({ name: 'dfouratk', textureRoot: 'equipments/dfour', textures: [0], frameRate: 1, count: 1 }));
                equipment.orbitingIcon.playAnimation('dfouratk');
                source.buff(2, 0);
            } else if (dieFace === 2) {
                equipment.orbitingIcon.addAnimation(Animations.fromTextureList({ name: 'dfourhp', textureRoot: 'equipments/dfour', textures: [4], frameRate: 1, count: 1 }));
                equipment.orbitingIcon.playAnimation('dfourhp');
                source.buff(0, 2);
            } else if (dieFace === 3) {
                equipment.orbitingIcon.addAnimation(Animations.fromTextureList({ name: 'dfourgold', textureRoot: 'equipments/dfour', textures: [8], frameRate: 1, count: 1 }));
                equipment.orbitingIcon.playAnimation('dfourgold');
                addStartShopEffect({ type: 'gold', sourceSquadIndex: source.squadIndexReference, gold: 6, });
            } else if (dieFace === 4) {
                equipment.orbitingIcon.addAnimation(Animations.fromTextureList({ name: 'dfourlevel', textureRoot: 'equipments/dfour', textures: [12], frameRate: 1, count: 1 }));
                equipment.orbitingIcon.playAnimation('dfourlevel');
                source.levelUp(undefined, true, false);
            }

            FIND_OPPONENT_WAIT_TIME = Math.max(FIND_OPPONENT_WAIT_TIME, 2);
        }
    }
}
