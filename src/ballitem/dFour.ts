namespace BallItems {
    export class DFour extends EquipmentItem {
        getName() { return 'd4'; }
        getDesc() {
            let PLAY = `${GAME_MODE === 'vs' || GAME_MODE === 'spectate' ? 'LOCK IN' : 'PLAY'}`;
            return `On ${PLAY}, take [gold]<coin>3 unspent[/gold] to permanently permanently gain status from [r]1<sword>[/r], [g]1<heart>[/g], [gold]<coin>1[/gold], or [gold]1<star>[/gold] randomly`;
        }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/dfour', 420);
        }

        canApplyToBall(ball: Ball): boolean {
            return !ball.isInShop;
        }
    }
}