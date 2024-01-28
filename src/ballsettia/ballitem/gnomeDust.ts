namespace BallItems {
    export class GnomeDust extends EquipmentItem {
        getName() { return 'Gnome Dust'; }
        getDesc() { return `At the start of battle, give [rb]Gnome equipment[/rb] and shrink allies to half of their size\n\nGnomed balls will grows two times as it rolls for ${Gnome.totalTimeToGain} seconds`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/gnomedust', 421);
        }
    }

    export class Gnome extends EquipmentItem {
        getName() { return 'Gnome'; }
        getDesc() { return `Grows two times as it rolls for ${Gnome.totalTimeToGain} seconds`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/gnome', 427);
        }

        static totalTimeToGain = 40;
    }
}