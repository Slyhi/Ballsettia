namespace BallItems {
    export class StarShooter extends EquipmentItem {
        getName() { return 'Shooting Star'; }
        getDesc() { return `On enter battle, sacrifice [gold]all of its <star>[/gold] to shoot at random enemies for [r]2<sword>[/r] splash damage per [gold]1<star>[/gold]`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/shootingstar', 422);
        }
    }
}