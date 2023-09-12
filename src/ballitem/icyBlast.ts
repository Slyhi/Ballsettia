namespace BallItems {
    export class IcyBlast extends EquipmentItem {
        getName() { return 'Icy Blast'; }
        getDesc() { return `At the start of battle, extingush nearby allies and freeze nearby enemies for 1s`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/icyblast', 424);
        }
    }
}