// ユーティリティ関数

// ============================================
// ゲーム定数（マジックナンバーを定数化）
// ============================================
var GAME_CONSTANTS = {
    // ダメージ減衰閾値
    DAMAGE_CAP: 2500000000,           // 25億（減衰開始）
    TIER1_RANGE: 1000000000,          // 10億（25億-35億）
    TIER2_RANGE: 1500000000,          // 15億（35億-50億）
    TIER3_RANGE: 5000000000,          // 50億（50億-100億）

    // ダメージ減衰率
    TIER1_RATE: 0.3,                  // 25億-35億: 30%
    TIER2_RATE: 0.1,                  // 35億-50億: 10%
    TIER3_RATE: 0.03,                 // 50億-100億: 3%
    TIER4_RATE: 0.01,                 // 100億以上: 1%

    // 乱数範囲
    RANDOM_PHY_MIN: 16,               // 物理最小乱数
    RANDOM_PHY_MAX: 47,               // 物理最大乱数
    RANDOM_MAG_MIN: 32,               // 魔法最小乱数
    RANDOM_MAG_MAX: 94,               // 魔法最大乱数
    RANDOM_DIVISOR: 25.6,             // 乱数除数

    // ダメージ倍率
    NORMAL_MULTIPLIER: 1.75,          // 通常倍率
    CRITICAL_MULTIPLIER: 3.25,        // クリティカル倍率
    RESIST_MODIFIER: 0.25,            // 耐性時倍率
    WEAK_MAG_MODIFIER: 2,             // 魔法弱点倍率

    // 防御係数
    DEF_DIVISOR_NORMAL: 2,            // 通常時防御除数
    DEF_DIVISOR_CRITICAL: 4,          // クリティカル時防御除数
    ATKB_DIVISOR: 32,                 // AtkB除数

    // バフ上限
    BUFF_CAP: 100,                    // 通常バフ上限
    PURPLE_BUFF_CAP: 350,             // 紫バフ上限
    MENTAL_CAP: 250,                  // メンタル上限

    // 下剋上計算
    OVERTHROW_DIVISOR_NORMAL: 200,    // 通常下剋上除数
    OVERTHROW_DIVISOR_MUJIMA: 700,    // 無印下剋上除数
    OVERTHROW_DIVISOR_ELPIS: 320,     // エルピス下剋上除数
    SHINGITTAI_RATE: 0.16,            // 心技体倍率

    // 単位
    OKU: 100000000                    // 億
};

// フォーム定数（ハードコーディング回避）
var FORM_CONFIG = {
    PHYSICAL: {
        name: 'PhysicP',
        type: 'Phy',
        base: 'Pwr'
    },
    MAGIC: {
        name: 'MagicI',
        type: 'Mag',
        base: 'Itg'
    }
};

/**
 * 指定した小数点以下y桁で切り捨て
 * @param {number} x - 対象の数値
 * @param {number} y - 小数点以下の桁数
 * @return {number} 切り捨て後の数値
 */
function RoundDown(x, y) {
    return Math.floor((x + Math.pow(10, -y-3)) * Math.pow(10, y)) / Math.pow(10, y);
}

/**
 * パーセントを倍率に変換（x% → x/100）
 * @param {number} x - パーセント値
 * @return {number} 倍率
 */
function PerChan(x) {
    return RoundDown(x / 100, 4);
}

/**
 * パーセント値を表示用文字列に変換
 * @param {number} x - パーセント値
 * @return {string} 小数点第1位までの文字列
 */
function PerOut(x) {
    return x.toFixed(1);
}

/**
 * 整数に切り捨て
 * @param {number} x - 対象の数値
 * @return {number} 整数部分
 */
function Int(x) {
    return RoundDown(x, 0);
}

/**
 * 25億超過ダメージ減衰計算 (Ver3.11.0)
 * @param {number} internalDmg - 内部ダメージ値
 * @return {number} 減衰後ダメージ
 */
function calcDamageReduction(internalDmg) {
    var C = GAME_CONSTANTS;
    if (internalDmg <= C.DAMAGE_CAP) return internalDmg;

    var result = C.DAMAGE_CAP; // 0-25億: 100%
    var remaining = internalDmg - C.DAMAGE_CAP;

    // 25億-35億 (内部): 30%
    var tier1 = Math.min(remaining, C.TIER1_RANGE);
    result += tier1 * C.TIER1_RATE;
    remaining -= tier1;
    if (remaining <= 0) return Int(result);

    // 35億-50億 (内部): 10%
    var tier2 = Math.min(remaining, C.TIER2_RANGE);
    result += tier2 * C.TIER2_RATE;
    remaining -= tier2;
    if (remaining <= 0) return Int(result);

    // 50億-100億 (内部): 3%
    var tier3 = Math.min(remaining, C.TIER3_RANGE);
    result += tier3 * C.TIER3_RATE;
    remaining -= tier3;
    if (remaining <= 0) return Int(result);

    // 100億以上 (内部): 1%
    result += remaining * C.TIER4_RATE;
    return Int(result);
}

/**
 * 億単位に変換 (小数点第2位まで)
 * @param {number} num - 変換する数値
 * @return {string} 億単位の文字列
 */
function toOku(num) {
    var oku = num / GAME_CONSTANTS.OKU;
    return oku.toFixed(2) + '億';
}

/**
 * 数値をフォーマット（桁簡略化対応）
 * @param {number} num - フォーマットする数値
 * @param {boolean} shorten - trueの場合、億単位で表示
 * @return {string} フォーマット済み文字列
 */
function formatNum(num, shorten) {
    if (shorten) {
        return toOku(num);
    } else {
        return num.toLocaleString();
    }
}

/**
 * ダメージ表示用フォーマット (25億超過時は2行表示)
 * @param {number} minDmg - 最小ダメージ
 * @param {number} maxDmg - 最大ダメージ
 * @param {boolean} shorten - 億単位で表示するか
 * @return {string} フォーマット済み文字列
 */
function formatDamageRange(minDmg, maxDmg, shorten) {
    var cap = GAME_CONSTANTS.DAMAGE_CAP;
    if (minDmg <= cap && maxDmg <= cap) {
        return formatNum(minDmg, shorten) + '～' + formatNum(maxDmg, shorten);
    } else {
        var minActual = calcDamageReduction(minDmg);
        var maxActual = calcDamageReduction(maxDmg);
        return '<span class="dmg-internal">' + t('results.internalDamage') + '：' + formatNum(minDmg, shorten) + '～' + formatNum(maxDmg, shorten) + '</span><br>' +
               '<span class="dmg-actual">' + t('results.reducedDamage') + '：' + formatNum(minActual, shorten) + '～' + formatNum(maxActual, shorten) + '</span>';
    }
}

/**
 * バフ減衰計算（複数バフの合算時に使用）
 * バフ値を大きい順にソートし、減衰率を適用して合計を計算
 * @param {Array<number>} list - バフ値の配列
 * @return {number} 減衰後の合計バフ値
 */
function Diminish(list) {
    var filtered = list.filter(function(v) { return v > 0; });
    if (filtered.length === 0) return 0;
    filtered.sort(function(a, b) { return b - a; });
    var dimi = RoundDown(filtered[0], 2);
    var sum = RoundDown(filtered[0], 2);
    for (var i = 1; i < filtered.length; i++) {
        filtered[i] = RoundDown(filtered[i], 2);
        dimi = RoundDown(dimi * filtered[i] / 100, 2);
        sum = sum + dimi;
    }
    return sum;
}

/**
 * 要素からint値を安全に取得する
 * @param {HTMLElement} elem - 入力要素
 * @return {number} 整数値（NaN時は0、負の値は0に変換）
 */
function getValue(elem) {
    if (!elem) return 0;
    var val = parseInt(elem.value);
    return isNaN(val) ? 0 : Math.max(val, 0);
}

/**
 * 要素からfloat値を安全に取得する
 * @param {HTMLElement} elem - 入力要素
 * @param {boolean} allowNegative - 負の値を許可するか（デフォルト: false）
 * @return {number} 数値（NaN時は0）
 */
function getNumber(elem, allowNegative) {
    if (!elem) return 0;
    var val = parseFloat(elem.value);
    if (isNaN(val)) return 0;
    // デフォルトでは負の値を許可しない（getValue()と一貫性を持たせる）
    return allowNegative ? val : Math.max(val, 0);
}
