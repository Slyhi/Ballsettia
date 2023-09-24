namespace BallItems {
    export class Gnome extends EquipmentItem {
        getName() { return 'Gnome'; }
        getDesc() { return `Grows two times as it rolls for ${this.totalTimeToGain} seconds`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/gnome', 427);
        }

        private totalTimeToGain = 20;
    }
}