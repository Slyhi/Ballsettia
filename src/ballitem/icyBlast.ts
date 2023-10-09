namespace BallItems {
    export class IcyBlast extends EquipmentItem {
        getName() { return 'Icy Blast'; }
        getDesc() { return `At the start of battle, [lb]freeze[/lb] and [lb]chill[/lb] nearby enemies for 5 seconds`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/icyblast', 424);
        }
    }
}