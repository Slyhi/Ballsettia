class EffectIcons extends Sprite {
    constructor() {
        super({
            copyFromParent: ['layer'],
        });
    }

    setIcons(effects: Ball.StatusEffect[]) {
        this.setTexture(EffectIcons.newTexture(effects));
    }
    
    private static newTexture(effects: Ball.StatusEffect[]) {
        if (effects.length <= 0) return new AnchoredTexture(new BasicTexture(0, 0, `EffectIcon.setIcon`, false), 0.5, 0.5);;
        let texture = new BasicTexture(9*effects.length - 1, 8, `EffectIcon.setIcon`, false);

        for (let i = effects.length-1; i >= 0; i--) {
            let effect = effects[i];
            let effectTexture = AssetCache.getTexture(`effecticon/${effect.type}`);
            effectTexture.renderTo(texture, { x: 4 + 9*(i), y: 4 })
        }

        texture.immutable = true;
        return new AnchoredTexture(texture, 0.5, 0.5);
    }
}