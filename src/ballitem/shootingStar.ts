namespace BallItems {
    export class ShootingStar extends EquipmentItem {
        getName() { return 'Shooting Star'; }
        getDesc() { return `At the start of battle, remove all stars from the equipped ball and fire star projectiles that deals 2 splash damage per star\n\nActivates after equipped ball abilities`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/shootingstar', 422);
        }
    }
}