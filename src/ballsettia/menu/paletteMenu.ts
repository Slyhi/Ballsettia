class PaletteMenu extends Menu {
    private settings: PaletteMenu.Settings;

    constructor(initialPage: PaletteMenu.Page) {
        super({
            backgroundColor: 0x000000,
            volume: 0,
            layers: [
                { name: 'world' },
                {
                    name: 'palettes',
                    mask: {
                        offsetx: PaletteMenu.MASK_X,
                        offsety: PaletteMenu.MASK_Y,
                        texture: Texture.filledRect(PaletteMenu.MASK_W, PaletteMenu.MASK_H, 0xFFFFFF),
                    },
                }
            ]
        });
        this.loadPage(initialPage);
        this.settings = loadPaletteSettings();
    }

    update() {
        super.update();

        if (Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            PaletteMenu.saveAndBack(this.settings);
        }
    }

    static saveAndBack(settings: PaletteMenu.Settings) {
        saveData('paletteSettings', settings);
        global.game.menuSystem.back();
    }
    
    private loadPage(page: PaletteMenu.Page) {
        this.removeWorldObjects(A.clone(this.worldObjects));

        let wawo = this.addWorldObject(new Theater.WorldAsWorldObject(_MENUS_ARENA_WORLD));
        wawo.layer = 'world';

        this.addWorldObjects(lciDocumentToWorldObjects('slyhi/palettemenu'));

        this.select.name<Sprite>('title').updateCallback = function() {
            this.angle = Math.sin(2*this.life.time) * 3;
        };

        for (let p of ['friend', 'enemy']) {
            let baseTint: number = 0xFFFFFF;
            if (p === page) {
                baseTint = Color.lerpColorByRgb(baseTint, 0x000000, 0.3);
            }
                
            let teamButton = this.select.name(p).addModule(new Button({
                hoverTint: 0xFFFF00,
                clickTint: 0xBBBB00,
                baseTint: baseTint,
                onJustHovered: juiceButton(1),
                onClick: () => {
                    global.game.playSound('click');
                    this.loadPage(<any>p);
                },
            }));

            let cp = p;
            this.select.name(p).updateCallback = function() {
                if (cp === page) teamButton.enabled = false;
            }
        }

        this.select.name<Sprite>('back').updateCallback = function() {
            this.angle = Math.sin(2*this.life.time+1) * 3;
        };
        this.select.name('back').addModule(new Button({
            hoverTint: 0xFFFF00,
            clickTint: 0xBBBB00,
            onJustHovered: juiceButton(1),
            onClick: () => {
                global.game.playSound('click');
                PaletteMenu.saveAndBack(this.settings);
            },
        }));

        let colorsBase: WorldObject = this.addWorldObject(new WorldObject({ x: this.width/2, y: PaletteMenu.MASK_Y + 25 }));

        this.loadColors(page, colorsBase);

        let totalEntriesHeight = Math.ceil(getAvailableColorTypesAll().length/8) * 46;
        let startY = colorsBase.y;

        let scrollBar = this.addWorldObject(new ScrollBar(310, 59, 'almanacscrollbar', totalEntriesHeight, 48,
            p => colorsBase.y = startY - (totalEntriesHeight - PaletteMenu.MASK_H) * p));
        scrollBar.effects.addOutline.color = 0xFFFFFF;

        this.addWorldObject(new DragScroller(scrollBar, totalEntriesHeight, rect(PaletteMenu.MASK_X, PaletteMenu.MASK_Y, PaletteMenu.MASK_W, PaletteMenu.MASK_H)));

        let infoBox = new InfoBox({ x: PaletteMenu.MASK_X, y: PaletteMenu.MASK_Y, width: PaletteMenu.MASK_W, height: PaletteMenu.MASK_H });
        infoBox.layer = World.DEFAULT_LAYER;
        this.addWorldObject(infoBox);

        this.update();
    }

    private loadColors(page: PaletteMenu.Page, colorsBase: WorldObject) {
        let box: { [type: number]: Sprite }, color: { [type: number]: Sprite }, cursor: { [page: string]: Sprite };
        for (let p of ['friend', 'enemy']) {
            cursor[p] = colorsBase.addChild(new Sprite({
                x: 56, y: 61,
                texture: `slyhi/palette/cursor/${p}`,
                layer: 'palettes',
                tint: p === page ? 0xFFFF00 : 0x888888,
            }));
        }
        let colorTypeList = getAvailableColorTypesAll();
        let swapPage = {'friend': 'enemy', 'enemy':'friend'}[page];
        let excludeColorTypes = this.settings[swapPage].similarColorTypes.concat(getColorTypeFromTypeDef(this.settings[swapPage]));

        let i = 0, j = 0;
        for (let type of colorTypeList) {
            box[type] = colorsBase.addChild(new Sprite({
                x: 22 + 34*i, y: 15 + 46*j,
                texture: 'slyhi/palette/box',
                layer: 'palettes',
            }));
            if (isColorTypeUnlocked(type)) {
                let typeDef = TYPE_TO_COLOR_TYPE_DEF[type];
                color[type] = colorsBase.addChild(new Sprite({
                    x: 22 + 34*i, y: 15 + 46*j,
                    name: typeDef.name,
                    texture: 'slyhi/palette/display',
                    layer: 'palettes',
                    bounds: new RectBounds(-14, -21, 28, 42),
                    data: { infoBoxDescription: typeDef.name },
                    effects: { post: { filters: [ new BallTeamColorFilter(typeDef.normalColor) ] } },
                }));
                if (_.contains(excludeColorTypes, type)) {
                    color[type].effects.post.filters = [new BallTeamColorFilter(0x808080)];
                    box[type].tint = 0x808080;
                    if (type === getColorTypeFromTypeDef(this.settings[swapPage])) {
                        cursor[swapPage].x = 22 + 34*i;
                        cursor[swapPage].y = 15 + 46*j;
                    }
                } else {
                    color[type].addModule(new Button({
                        onClick: () => {
                            global[type].game.playSound('medkitheal');
                            box[getColorTypeFromTypeDef(this.settings[page])].tint = 0xFFFFFF;
                            cursor[page].x = 22 + 34*i;
                            cursor[page].y = 15 + 46*j;
                            this.settings[page] = typeDef;
                            box[type].tint = 0xFFFF00;
                        },
                        onHover: () => {
                            color[type].tint = 0xFFFF00;
                            box[type].tint = 0xFFFF00;
                        },
                        onUnhover: () => {                
                            color[type].tint = 0xFFFFFF;
                            box[type].tint = 0xFFFFFF;
                        },
                        onJustHovered: juiceButton(1),
                    }));
                }
                World.Actions.moveWorldObjectToFront(color[type]);
            } else {
                box[type].setTexture('slyhi/palette/locked');
                box[type].tint = 0x555555;
            }
            World.Actions.moveWorldObjectToBack(box[type]);
            i++;
            if (i >= 8) {
                i = 0;
                j++;
            }
        }
    }
}

// ******************************************************************************************
namespace PaletteMenu {
    export const MASK_X = 26;
    export const MASK_Y = 62;
    export const MASK_W = 268;
    export const MASK_H = 144;

    // export function GETBOX() { return new LazyValue(() => new AnchoredTexture(Texture.ninepatch(AssetCache.getTexture('infobox_9p'), rect(4, 4, 4, 4), 28, 42), 0.5, 0.5)) }
    export function GET_DEFAULT_SETTINGS(): Settings {
        return {
            friend: TYPE_TO_COLOR_TYPE_DEF[17],
            enemy: TYPE_TO_COLOR_TYPE_DEF[11],
            neutral: TYPE_TO_COLOR_TYPE_DEF[1],
        }
    }

    export type Page = 'friend' | 'enemy';
    export type Settings = {
        friend: ColorTypeDef,
        enemy: ColorTypeDef,
        neutral: ColorTypeDef,
    }
}