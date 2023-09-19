namespace BallItems {
    export class DFour extends EquipmentItem {
        getName() { return 'd4'; }
        getDesc() {
            let PLAY = `${GAME_MODE === 'vs' || GAME_MODE === 'spectate' ? 'LOCK IN' : 'PLAY'}`;
            return `On ${PLAY}, take [gold]<coin>5 unspent[/gold] to permanently gain [r]2<sword>[/r], [g]2<heart>[/g], [gold]1<star>[/gold], or [gold]<coin>7[/gold] randomly`;
        }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, `items/dfour/${Ball.Random.int(0, 11)}`, 420);
        }

        canApplyToBall(ball: Ball): boolean {
            return !ball.isInShop;
        }
    }
}