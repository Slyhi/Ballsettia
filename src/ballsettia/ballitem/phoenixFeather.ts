namespace BallItems {
    export class PhoenixFeather extends EquipmentItem {
        getName() { return 'Phoenix Feather'; }
        getDesc() { return `Take 50% less damage from the burning or chilling effect and burn the killerfor [lb]1s[/lb] on death\n\nEach [gold]<star>[/gold] on the equipped ball adds [lb]1s[/lb] to the burn time`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/phoenixfeather', 426);
        }
    }
}