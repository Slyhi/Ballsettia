namespace BallItems {
    export class Latte extends EquipmentItem {
        getName() { return 'Latte'; }
        getDesc() { return `Leave a pool of latte which increase balls speed in latte art direction`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/latte', 425);
        }
    }
}