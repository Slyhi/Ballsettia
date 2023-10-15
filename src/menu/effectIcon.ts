class EffectIcons extends Sprite {
    constructor() {
        super({
            copyFromParent: ['layer'],
        });
    }

    setIcons(effects: string) {
        let cache = EffectIcons.effectCache;
        this.setTexture(cache.get(effects));
    }

    private static effectCache = new LazyDict(effects => EffectIcons.newTexture(effects));
    
    private static newTexture(e: string) {
        let effects = e.split(',');
        let texture = new BasicTexture(9*effects.length - 1, 8, `EffectIcon.newTexture`, false);

        for (let i = effects.length-1; i >= 0; i--) {
            let effectTexture = AssetCache.getTexture(`effecticon/${effects[i]}`);
            effectTexture.renderTo(texture, { x: 4 + 9*(i), y: 4 });
        }

        texture.immutable = true;
        return new AnchoredTexture(texture, 0.5, 0.5);
    }
}