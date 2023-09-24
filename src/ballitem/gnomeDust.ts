namespace BallItems {
    export class GnomeDust extends EquipmentItem {
        getName() { return 'Gnome Dust'; }
        getDesc() { return `At the start of battle, shrink the equipped ball and nearby allies to half of their size`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/gnomedust', 421);
        }
    }
}