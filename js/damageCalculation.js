// ダメージ計算メイン関数

// ============================================
// ヘルパー関数（計算チェーン簡略化）
// ============================================

/**
 * 連続乗算計算のヘルパー（ネスト削減）
 * @param {number} base - 基礎値
 * @param {Array} multipliers - 乗算する倍率の配列
 * @return {number} 計算結果（各乗算後にInt適用）
 */
function applyMultipliers(base, multipliers) {
    var result = base;
    for (var i = 0; i < multipliers.length; i++) {
        result = Int(result * multipliers[i]);
    }
    return result;
}

/**
 * 加算型バフ適用のヘルパー
 * @param {number} base - 基礎ダメージ
 * @param {number} multiplier - 倍率（1を引いた値を使用）
 * @return {number} 適用後ダメージ
 */
function applyAdditiveMultiplier(base, multiplier) {
    return Int(base * (multiplier - 1)) + base;
}

/**
 * メイン計算関数
 * @param {string} x - フォーム名
 * @param {string} type - 'Phy' or 'Mag'
 * @param {string} base - 'Pwr' or 'Itg'
 */
function calculate(x, type, base) {
    var f = document.forms[x];
    var C = GAME_CONSTANTS;

    // 基礎ステータス取得
    var Pwr = getValue(f.Pwr), Itg = getValue(f.Itg);
    var WpPhyAtk = getValue(f.WpPhyAtk), WpMagAtk = getValue(f.WpMagAtk);
    var PhyPAtk = Pwr + WpPhyAtk, MagIAtk = Itg + WpMagAtk;
    var Def = getValue(f.PhyDef), Mod = RoundDown(cMod(x) * cMulti(x), 2);

    // DOM更新
    var phyAtkElem = document.getElementById(x + '-PhyAtk');
    var magAtkElem = document.getElementById(x + '-MagAtk');
    if (phyAtkElem) phyAtkElem.textContent = PhyPAtk;
    if (magAtkElem) magAtkElem.textContent = MagIAtk;

    // 攻撃力と属性修正の計算
    var AtkA, AtkBAlly, AtkBEne, EleA, EleB;
    if (type === 'Phy' && base === 'Pwr') {
        AtkA = Int((PhyPAtk + cLuna1Edr(x) + cPwrUp(x)) * cPwrBf(x));
        AtkBAlly = Pwr;
        AtkBEne = Int((Pwr + cLuna1Edr(x) + cPwrUp(x)) * cPwrBf(x));
        EleA = MagIAtk;
        EleB = Int((Itg + cLuna1Spr(x) + cItgUp(x)) * cItgBf(x)) + WpMagAtk;
    } else if (type === 'Mag' && base === 'Itg') {
        AtkA = Int((MagIAtk + cLuna1Spr(x) + cItgUp(x)) * cItgBf(x));
        AtkBAlly = Itg;
        AtkBEne = Int((Itg + cLuna1Spr(x) + cItgUp(x)) * cItgBf(x));
        EleA = Itg;
        EleB = 0;
    }

    // 各種倍率計算
    var EleMod = (Math.sqrt(EleA * 10 + 16) - 4) / 64 + 1;
    var ResistMod = C.RESIST_MODIFIER;
    var WeakMod, minRandom, maxRandom;

    if (type === 'Phy') {
        WeakMod = (EleB + Math.sqrt(EleB * 2)) / 512 + 1.85;
        minRandom = C.RANDOM_PHY_MIN;
        maxRandom = C.RANDOM_PHY_MAX;
    } else {
        WeakMod = C.WEAK_MAG_MODIFIER;
        minRandom = C.RANDOM_MAG_MIN;
        maxRandom = C.RANDOM_MAG_MAX;
    }

    WeakMod = WeakMod + cWeakBf(x) + cLuna3Weak(x);
    f.EleMod.value = EleMod.toFixed(2);
    f.WeakMod.value = WeakMod.toFixed(2);

    // ダメージ配列初期化
    var Dmg = [];
    for (var i = 0; i < 5; i++) Dmg[i] = [0, 0, 0, 0, 0, 0, 0, 0];

    // 基礎ダメージ計算
    // i=0: 味方AtkB使用, i=4: 敵AtkB使用
    var indices = [0, 4];
    for (var idx = 0; idx < indices.length; idx++) {
        var i = indices[idx];
        var AtkB = (i === 0) ? AtkBAlly : AtkBEne;
        var AtkBMod = AtkB / C.ATKB_DIVISOR + 1;

        // 通常攻撃（防御/2）
        var baseNormal = (AtkA - Def / C.DEF_DIVISOR_NORMAL) * AtkBMod * C.NORMAL_MULTIPLIER;
        // クリティカル（防御/4）
        var baseCritical = (AtkA - Def / C.DEF_DIVISOR_CRITICAL) * AtkBMod * C.CRITICAL_MULTIPLIER;

        // [0-1] 通常・属性あり [2-3] 通常・属性なし
        Dmg[i][0] = Int((Math.max(baseNormal * EleMod, 1) + AtkA * minRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][1] = Int((Math.max(baseNormal * EleMod, 1) + AtkA * maxRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][2] = Int((Math.max(baseNormal, 1) + AtkA * minRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][3] = Int((Math.max(baseNormal, 1) + AtkA * maxRandom / C.RANDOM_DIVISOR) * Mod);

        // [4-5] クリティカル・属性あり [6-7] クリティカル・属性なし
        Dmg[i][4] = Int((Math.max(baseCritical * EleMod, 1) + AtkA * minRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][5] = Int((Math.max(baseCritical * EleMod, 1) + AtkA * maxRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][6] = Int((Math.max(baseCritical, 1) + AtkA * minRandom / C.RANDOM_DIVISOR) * Mod);
        Dmg[i][7] = Int((Math.max(baseCritical, 1) + AtkA * maxRandom / C.RANDOM_DIVISOR) * Mod);
    }

    // 弱点・耐性計算
    for (var j = 0; j < 8; j++) {
        Dmg[1][j] = Int(Dmg[0][j] * WeakMod);
        Dmg[2][j] = Int(Dmg[0][j] * ResistMod);
    }

    // バフ適用ループ
    for (var i = 0; i < 5; i++) {
        if (i === 3) continue;  // i=3はスキップ

        // 属性タイプ判定（属性ダメージの場合: j < 2 または 4 <= j < 6）
        var isElemental = function(j) { return j < 2 || (j >= 4 && j < 6); };

        for (var j = 0; j < 8; j++) {
            var dmg = Dmg[i][j];

            // 1. 耐性デバフ適用
            if (type === 'Phy') {
                if (isElemental(j)) {
                    dmg = Int(dmg * (cEleRDb(x) - 1)) + Int(dmg * (cPhyRDb(x) - 1)) + dmg;
                } else {
                    dmg = applyAdditiveMultiplier(dmg, cPhyRDb(x));
                }
            } else {
                if (isElemental(j)) {
                    dmg = Int(dmg * (cEleRDb(x) - 1)) + Int(dmg * (cMagRDb(x) - 1)) + dmg;
                } else {
                    dmg = applyAdditiveMultiplier(dmg, cMagRDb(x));
                }
            }

            // 2. 紫バフ適用
            var purpleMod = (type === 'Phy') ? cPurplePhy(x) : cPurpleMag(x);
            dmg = dmg * purpleMod;

            // 3. 属性・武器・コンボバフ
            dmg = applyMultipliers(dmg, [cEleBf(x), cWpBf(x), cCombo(x)]);

            // 4. 装備属性・HP装備バフ（加算型）
            dmg = Int(dmg * (cEleBfEq(x) - 1)) + Int(dmg * (cHpBfEq(x) - 1)) + dmg;

            // 5. 絶望バフ
            dmg = Int(dmg * cDespair(x));

            // 6. PP（パーソナリティ）バフ - ネストを削減
            dmg = applyMultipliers(dmg, [
                cPP(x, 0), cPP(x, 1), cPP(x, 2),
                cPPEq(x, 0), cPPEq(x, 1), cPPEq(x, 2),
                cPPEq(x, 3), cPPEq(x, 4), cPPEq(x, 5)
            ]);

            // 7. セルフPP
            dmg = applyMultipliers(dmg, [cSelfPP(x, 0), cSelfPP(x, 1), cSelfPP(x, 2)]);

            // 8. 弱点ボーナス（i === 1の場合のみ）
            if (i === 1) dmg = Int(dmg * cWeak(x));

            // 9. MP消費・敵数・ルナ倍率
            dmg = applyMultipliers(dmg, [cMpCost(x), cEneNum(x), cLuna3(x), cLuna2(x)]);

            // 10. クリティカル基礎（j >= 4の場合）
            if (j >= 4) dmg = Int(dmg * cCri(x));

            // 11. HPバフ・DBS
            dmg = applyMultipliers(dmg, [cHpBf(x), cDbs(x)]);

            // 12. クリティカルバフ（j >= 4の場合、切り上げ）
            if (j >= 4) dmg = Math.ceil(dmg * cCriBf(x));

            // 13. 各種特殊バフ
            dmg = applyMultipliers(dmg, [
                cOoAf(x), cTenmei(x), cAZ(x),
                cZoneDmg(x), cOverthrowEq(x), cGrowUp(x)
            ]);

            // 14. 成長デバフ（減算）
            dmg = dmg - Int(dmg * cGrowDown(x));

            // 15. ゾーン・歌・祈りバフ（加算型）
            dmg = applyAdditiveMultiplier(dmg, cZone(x));
            dmg = applyAdditiveMultiplier(dmg, cSing(x));
            dmg = applyAdditiveMultiplier(dmg, cPray(x));

            // 16. バリア・ブレイク・オーラ・環境
            dmg = Int(dmg * (1 - cBarrier(x)));
            dmg = applyMultipliers(dmg, [cBreak(x), cAura(x), cEnv(x), cOverCri(x), cSingle(x)]);

            // 17. フリーバフ
            dmg = applyMultipliers(dmg, [
                cFree(x, 0), cFree(x, 1), cFree(x, 2),
                cFree(x, 3), cFree(x, 4), cFree(x, 5)
            ]);

            Dmg[i][j] = dmg;
        }
    }

    var shorten = f.ChkShorten && f.ChkShorten.checked;
    document.getElementById(x + '_EleNor').innerHTML = formatDamageRange(Dmg[0][0], Dmg[0][1], shorten);
    document.getElementById(x + '_Nor').innerHTML = formatDamageRange(Dmg[0][2], Dmg[0][3], shorten);
    document.getElementById(x + '_EleNorCri').innerHTML = formatDamageRange(Dmg[0][4], Dmg[0][5], shorten);
    document.getElementById(x + '_NorCri').innerHTML = formatDamageRange(Dmg[0][6], Dmg[0][7], shorten);
    document.getElementById(x + '_EleWeak').innerHTML = formatDamageRange(Dmg[1][0], Dmg[1][1], shorten);
    document.getElementById(x + '_Weak').innerHTML = formatDamageRange(Dmg[1][2], Dmg[1][3], shorten);
    document.getElementById(x + '_EleWeakCri').innerHTML = formatDamageRange(Dmg[1][4], Dmg[1][5], shorten);
    document.getElementById(x + '_WeakCri').innerHTML = formatDamageRange(Dmg[1][6], Dmg[1][7], shorten);
    document.getElementById(x + '_EleResist').innerHTML = formatDamageRange(Dmg[2][0], Dmg[2][1], shorten);
    document.getElementById(x + '_Resist').innerHTML = formatDamageRange(Dmg[2][2], Dmg[2][3], shorten);
    document.getElementById(x + '_EleResistCri').innerHTML = formatDamageRange(Dmg[2][4], Dmg[2][5], shorten);
    document.getElementById(x + '_ResistCri').innerHTML = formatDamageRange(Dmg[2][6], Dmg[2][7], shorten);
    document.getElementById(x + '_EleEnemy').innerHTML = formatDamageRange(Dmg[4][0], Dmg[4][1], shorten);
    document.getElementById(x + '_Enemy').innerHTML = formatDamageRange(Dmg[4][2], Dmg[4][3], shorten);
    document.getElementById(x + '_EleEnemyCri').innerHTML = formatDamageRange(Dmg[4][4], Dmg[4][5], shorten);
    document.getElementById(x + '_EnemyCri').innerHTML = formatDamageRange(Dmg[4][6], Dmg[4][7], shorten);

    // 浮遊ダメージ表示を更新
    updateFloatingDamage(Dmg[0][4], Dmg[0][5], Dmg[1][4], Dmg[1][5]);
}

// 浮遊ダメージ表示の更新（前回の値を記憶してアニメーション）
var previousNormalDamage = null;
var previousWeakDamage = null;

function updateFloatingDamage(normalMin, normalMax, weakMin, weakMax) {
    var normalElem = document.getElementById('float-normal');
    var weakElem = document.getElementById('float-weak');

    if (!normalElem || !weakElem) return;

    var normalAvg = Math.floor((normalMin + normalMax) / 2);
    var weakAvg = Math.floor((weakMin + weakMax) / 2);

    // 通常ダメージの更新とアニメーション
    if (previousNormalDamage !== null && previousNormalDamage !== normalAvg) {
        normalElem.classList.remove('increase', 'decrease');
        void normalElem.offsetWidth; // reflow
        normalElem.classList.add(normalAvg > previousNormalDamage ? 'increase' : 'decrease');
    }
    normalElem.textContent = formatNum(normalAvg, false);
    previousNormalDamage = normalAvg;

    // 弱点ダメージの更新とアニメーション
    if (previousWeakDamage !== null && previousWeakDamage !== weakAvg) {
        weakElem.classList.remove('increase', 'decrease');
        void weakElem.offsetWidth; // reflow
        weakElem.classList.add(weakAvg > previousWeakDamage ? 'increase' : 'decrease');
    }
    weakElem.textContent = formatNum(weakAvg, false);
    previousWeakDamage = weakAvg;
}
