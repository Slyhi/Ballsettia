type ColorTypeDef = {
    name: string;
    normalColor: number;
    darkColor: number;
    lightColor: number;
    similarColorTypes: number[];
    isUnlocked?: () => boolean;
}

const TYPE_TO_COLOR_TYPE_DEF: { [type: number]: ColorTypeDef } = {
    0: { name: 'White', normalColor: 0xD3D3D3, darkColor: 0xA4A4A4, lightColor: 0xFCFCFC, similarColorTypes: [1, 9], },
    1: { name: 'Silver', normalColor: 0x808080, darkColor: 0x404040, lightColor: 0xBFBFBF, similarColorTypes: [0, 2, 3], isUnlocked: () => false, },
    2: { name: 'Wenge', normalColor: 0x645452, darkColor: 0x333333, lightColor: 0xB39C99, similarColorTypes: [1, 3, 4], },
    3: { name: 'Black', normalColor: 0x3F3F3F, darkColor: 0x000000, lightColor: 0x626262, similarColorTypes: [1, 2], },
    4: { name: 'Brown', normalColor: 0x965930, darkColor: 0x381600, lightColor: 0xEDA270, similarColorTypes: [2, 24], },
    5: { name: 'Tangerine', normalColor: 0xFF6A00, darkColor: 0x954811, lightColor: 0xFFBD8E, similarColorTypes: [6, 7], },
    6: { name: 'Salmon', normalColor: 0xFF865C, darkColor: 0xB1431E, lightColor: 0xF7C0AD, similarColorTypes: [5, 7], },
    7: { name: 'Orange', normalColor: 0xF29125, darkColor: 0x704211, lightColor: 0xFFC687, similarColorTypes: [5, 6], },
    8: { name: 'Khaki', normalColor: 0xC3b091, darkColor: 0x5D4B30, lightColor: 0xE8E1D5, similarColorTypes: [7, 8], },
    9: { name: 'Beige', normalColor: 0xF9D595, darkColor: 0xBA8F43, lightColor: 0xFFF3DD, similarColorTypes: [0, 8, 10], isUnlocked: () => false, },
    10: { name: 'Yellow', normalColor: 0xF4E314, darkColor: 0xBD9511, lightColor: 0xFFFFAB, similarColorTypes: [8, 9], },
    11: { name: 'Lime', normalColor: 0x00BB00, darkColor: 0x005D00, lightColor: 0x7FDD7F, similarColorTypes: [12, 13], },
    12: { name: 'Green', normalColor: 0x008910, darkColor: 0x004907, lightColor: 0x75C87D, similarColorTypes: [11, 13], },
    13: { name: 'Evergreen', normalColor: 0x3C6E50, darkColor: 0x0E381F, lightColor: 0x72B98E, similarColorTypes: [11, 12, 14], },
    14: { name: 'Turquoise', normalColor: 0x23AFA4, darkColor: 0x166F68, lightColor: 0x7BE9E0, similarColorTypes: [13, 15, 16], },
    15: { name: 'Seafoam', normalColor: 0x07E8B4, darkColor: 0x007B5F, lightColor: 0xAEFFEC, similarColorTypes: [14, 16], },
    16: { name: 'Aqua', normalColor: 0x07E0E3, darkColor: 0x0F8787, lightColor: 0xBFFFFF, similarColorTypes: [14, 15], },
    17: { name: 'Azure', normalColor: 0x0094FF, darkColor: 0x004A7F, lightColor: 0x8ECFFF, similarColorTypes: [18, 19], },
    18: { name: 'Blue', normalColor: 0x484DFF, darkColor: 0x24267F, lightColor: 0xA3A6FF, similarColorTypes: [17, 19, 20], },
    19: { name: 'Indigo', normalColor: 0x2A2D6E, darkColor: 0x050735, lightColor: 0x767AC7, similarColorTypes: [17, 18], },
    20: { name: 'Purple', normalColor: 0xB200FF, darkColor: 0x5E0089, lightColor: 0xCC93E5, similarColorTypes: [18, 21, 22], },
    21: { name: 'Pink', normalColor: 0xFF61E6, darkColor: 0x92147E, lightColor: 0xFFB1F3, similarColorTypes: [20, 22], },
    22: { name: 'Fuchsia', normalColor: 0xE93C8D, darkColor: 0x60163D, lightColor: 0xFBAFD3, similarColorTypes: [20, 21, 23], },
    23: { name: 'Red', normalColor: 0xE52020, darkColor: 0x7F0000, lightColor: 0xED8484, similarColorTypes: [22, 24], },
    24: { name: 'Chestnut', normalColor: 0x9D4939, darkColor: 0x511E13, lightColor: 0xDD9689, similarColorTypes: [4, 23], },
}

function getColorTypeFromTypeDef(typeDef: ColorTypeDef) {
    return Object.keys(TYPE_TO_COLOR_TYPE_DEF).map(type => parseInt(type)).find(key => TYPE_TO_COLOR_TYPE_DEF[key] === typeDef) ?? 1;
}

function getColorTypeFromColorName(colorName: string): number {
    return Object.keys(TYPE_TO_COLOR_TYPE_DEF).map(type => parseInt(type)).find(key => TYPE_TO_COLOR_TYPE_DEF[key].name === colorName) ?? 1;
}

function getAvailableColorTypesAll(): number[] {
    return Object.keys(TYPE_TO_COLOR_TYPE_DEF).map(type => parseInt(type)).filter(type => type !== 1);
}

function isColorTypeUnlocked(colorType: number) {
    if (!(colorType in TYPE_TO_ITEM_TYPE_DEF)) {
        console.error('Invalid item type:', colorType, 'Defaulting to locked');
        return false;
    }
    let typeDef = TYPE_TO_ITEM_TYPE_DEF[colorType];
    return !typeDef.isUnlocked || typeDef.isUnlocked();
}