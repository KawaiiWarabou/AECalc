// バフ・デバフ計算関数

// ============================================
// ヘルパー関数（重複コード削減）
// ============================================

/**
 * シンプルなバフ計算のヘルパー
 * チェックボックスがオンの場合、値を取得してパーセント倍率を返す
 * @param {HTMLFormElement} f - フォーム
 * @param {string} chkName - チェックボックス名
 * @param {string} inputName - 入力フィールド名
 * @param {number} defaultVal - デフォルト値（デフォルト: 0）
 * @return {number} 倍率
 */
function simpleBuffCalc(f, chkName, inputName, defaultVal) {
    if (!f[chkName] || !f[chkName].checked) return 1;
    var val = getNumber(f[inputName]);
    return PerChan(Math.max(val, defaultVal || 0)) + 1;
}

/**
 * バフ/デバフ対称計算のヘルパー
 * バフとデバフの両方を計算し、結果を表示フィールドに出力
 * @param {HTMLFormElement} f - フォーム
 * @param {string} prefix - フィールド名プレフィックス（例: 'Pwr', 'Itg'）
 * @param {boolean} isDebuff - デバフ計算の場合true
 * @return {number} 倍率
 */
function buffDebuffCalc(f, prefix, isDebuff) {
    var C = GAME_CONSTANTS;
    var bfChk = 'Chk' + prefix + 'Bf';
    var dbChk = 'Chk' + prefix + 'Db';
    var outField = prefix + 'Bf';

    if (!f[bfChk]) {
        if (f[outField]) f[outField].value = '0.0';
        return 1;
    }

    var bf = f[bfChk].checked ? Diminish([
        getNumber(f[prefix + 'Bf1']),
        getNumber(f[prefix + 'Bf2']),
        getNumber(f[prefix + 'Bf3'])
    ]) : 0;

    var db = f[dbChk] && f[dbChk].checked ? Diminish([
        getNumber(f[prefix + 'Db1']),
        getNumber(f[prefix + 'Db2']),
        getNumber(f[prefix + 'Db3'])
    ]) : 0;

    var cal = Math.min(Math.max(bf - db, -C.BUFF_CAP), C.BUFF_CAP);
    if (f[outField]) f[outField].value = PerOut(cal);

    if (!f[bfChk].checked && !(f[dbChk] && f[dbChk].checked)) return 1;
    return PerChan(cal) + 1;
}

/**
 * 耐性デバフ計算のヘルパー
 * @param {HTMLFormElement} f - フォーム
 * @param {string} prefix - フィールド名プレフィックス（例: 'PhyR', 'MagR', 'EleR'）
 * @return {number} 倍率
 */
function resistDebuffCalc(f, prefix) {
    var C = GAME_CONSTANTS;
    var dbChk = 'Chk' + prefix + 'Db';
    var bfChk = 'Chk' + prefix + 'Bf';
    var outField = prefix + 'Db';

    if (!f[dbChk]) {
        if (f[outField]) f[outField].value = '0.0';
        return 1;
    }

    var db = f[dbChk].checked ? Diminish([
        getNumber(f[prefix + 'Db1']),
        getNumber(f[prefix + 'Db2']),
        getNumber(f[prefix + 'Db3'])
    ]) : 0;

    var bf = f[bfChk] && f[bfChk].checked ? Diminish([
        getNumber(f[prefix + 'Bf1']),
        getNumber(f[prefix + 'Bf2']),
        getNumber(f[prefix + 'Bf3'])
    ]) : 0;

    var cal = Math.min(Math.max(db - bf, -C.BUFF_CAP), C.BUFF_CAP);
    if (f[outField]) f[outField].value = PerOut(cal);

    if (!f[dbChk].checked && !(f[bfChk] && f[bfChk].checked)) return 1;
    return PerChan(cal) + 1;
}

// ============================================
// ステータスバフ関数
// ============================================

function cPwrBf(x) {
    var f = document.forms[x];
    if (!f.ChkPwrBf) { if (f.PwrBf) f.PwrBf.value = '0.0'; return 1; }
    var bf = f.ChkPwrBf.checked ? Diminish([getNumber(f.PwrBf1), getNumber(f.PwrBf2), getNumber(f.PwrBf3)]) : 0;
    var db = f.ChkPwrDb && f.ChkPwrDb.checked ? Diminish([getNumber(f.PwrDb1), getNumber(f.PwrDb2), getNumber(f.PwrDb3)]) : 0;
    var cal = Math.min(Math.max(bf - db, -100), 100);
    if (f.PwrBf) f.PwrBf.value = PerOut(cal);
    if (!f.ChkPwrBf.checked && !(f.ChkPwrDb && f.ChkPwrDb.checked)) return 1;
    return PerChan(cal) + 1;
}

function cItgBf(x) {
    var f = document.forms[x];
    if (!f.ChkItgBf) { if (f.ItgBf) f.ItgBf.value = '0.0'; return 1; }
    var bf = f.ChkItgBf.checked ? Diminish([getNumber(f.ItgBf1), getNumber(f.ItgBf2), getNumber(f.ItgBf3)]) : 0;
    var db = f.ChkItgDb && f.ChkItgDb.checked ? Diminish([getNumber(f.ItgDb1), getNumber(f.ItgDb2), getNumber(f.ItgDb3)]) : 0;
    var cal = Math.min(Math.max(bf - db, -100), 100);
    if (f.ItgBf) f.ItgBf.value = PerOut(cal);
    if (!f.ChkItgBf.checked && !(f.ChkItgDb && f.ChkItgDb.checked)) return 1;
    return PerChan(cal) + 1;
}

function cPhyRDb(x) {
    var f = document.forms[x];
    if (!f.ChkPhyRDb) { if (f.PhyRDb) f.PhyRDb.value = '0.0'; return 1; }
    var db = f.ChkPhyRDb.checked ? Diminish([getNumber(f.PhyRDb1), getNumber(f.PhyRDb2), getNumber(f.PhyRDb3)]) : 0;
    var bf = f.ChkPhyRBf && f.ChkPhyRBf.checked ? Diminish([getNumber(f.PhyRBf1), getNumber(f.PhyRBf2), getNumber(f.PhyRBf3)]) : 0;
    var cal = Math.min(Math.max(db - bf, -100), 100);
    if (f.PhyRDb) f.PhyRDb.value = PerOut(cal);
    if (!f.ChkPhyRDb.checked && !(f.ChkPhyRBf && f.ChkPhyRBf.checked)) return 1;
    return PerChan(cal) + 1;
}

function cMagRDb(x) {
    var f = document.forms[x];
    if (!f.MagRBf1) return 1;
    if (!f.ChkMagRDb) { if (f.MagRDb) f.MagRDb.value = '0.0'; return 1; }
    var db = f.ChkMagRDb.checked ? Diminish([getNumber(f.MagRDb1), getNumber(f.MagRDb2), getNumber(f.MagRDb3)]) : 0;
    var bf = f.ChkMagRBf && f.ChkMagRBf.checked ? Diminish([getNumber(f.MagRBf1), getNumber(f.MagRBf2), getNumber(f.MagRBf3)]) : 0;
    var cal = Math.min(Math.max(db - bf, -100), 100);
    if (f.MagRDb) f.MagRDb.value = PerOut(cal);
    if (!f.ChkMagRDb.checked && !(f.ChkMagRBf && f.ChkMagRBf.checked)) return 1;
    return PerChan(cal) + 1;
}

function cEleRDb(x) {
    var f = document.forms[x];
    if (!f.ChkEleRDb) { if (f.EleRDb) f.EleRDb.value = '0.0'; return 1; }
    var db = f.ChkEleRDb.checked ? Diminish([getNumber(f.EleRDb1), getNumber(f.EleRDb2), getNumber(f.EleRDb3)]) : 0;
    var bf = f.ChkEleRBf && f.ChkEleRBf.checked ? Diminish([getNumber(f.EleRBf1), getNumber(f.EleRBf2), getNumber(f.EleRBf3)]) : 0;
    var cal = Math.min(Math.max(db - bf, -100), 100);
    if (f.EleRDb) f.EleRDb.value = PerOut(cal);
    if (!f.ChkEleRDb.checked && !(f.ChkEleRBf && f.ChkEleRBf.checked)) return 1;
    return PerChan(cal) + 1;
}

function cWpBf(x) {
    var f = document.forms[x];
    if (!f.ChkWpBf || !f.ChkWpBf.checked) { if (f.WpBf) f.WpBf.value = '0.0'; return 1; }
    var cal = Math.min(Diminish([getNumber(f.WpBf1), getNumber(f.WpBf2), getNumber(f.WpBf3)]), 100);
    if (f.WpBf) f.WpBf.value = PerOut(cal);
    return PerChan(cal) + 1;
}

function cEleBf(x) {
    var f = document.forms[x];
    if (!f.ChkEleBf) { if (f.EleBf) f.EleBf.value = '0.0'; return 1; }
    var bf = f.ChkEleBf.checked ? Diminish([getNumber(f.EleBf1), getNumber(f.EleBf2), getNumber(f.EleBf3)]) : 0;
    var db = f.ChkEleDb && f.ChkEleDb.checked ? Diminish([getNumber(f.EleDb1), getNumber(f.EleDb2), getNumber(f.EleDb3)]) : 0;
    var cal = Math.min(Math.max(bf - db, -100), 100);
    if (f.EleBf) f.EleBf.value = PerOut(cal);
    if (!f.ChkEleBf.checked && !(f.ChkEleDb && f.ChkEleDb.checked)) return 1;
    return PerChan(cal) + 1;
}

function cEleBfEq(x) {
    var f = document.forms[x];
    return f.ChkEleBfEq && f.ChkEleBfEq.checked ? PerChan(getNumber(f.EleBfEq1)) + 1 : 1;
}

function cHpBf(x) {
    var f = document.forms[x];
    return f.ChkHpBf && f.ChkHpBf.checked ? PerChan(Math.max(getNumber(f.HpBf1), 0)) + 1 : 1;
}

function cHpBfEq(x) {
    var f = document.forms[x];
    return f.ChkHpBfEq && f.ChkHpBfEq.checked ? PerChan(Math.max(getNumber(f.HpBfEq1), 0)) + 1 : 1;
}

function cCri(x) {
    var f = document.forms[x];
    return f.ChkCri && f.ChkCri.checked ? PerChan(Math.max(getNumber(f.Cri1), 0)) + 1 : 1;
}

function cCriBf(x) {
    var f = document.forms[x];
    return f.ChkCriBf && f.ChkCriBf.checked ? PerChan(Math.max(getNumber(f.CriBf1), 0)) + 1 : 1;
}

function cWeak(x) {
    var f = document.forms[x];
    return f.ChkWeak && f.ChkWeak.checked ? PerChan(Math.max(getNumber(f.Weak1), 0)) + 1 : 1;
}

function cWeakBf(x) {
    var f = document.forms[x];
    return f.ChkWeakBf && f.ChkWeakBf.checked ? getNumber(f.WeakBf1) : 0;
}

function cZone(x) {
    var f = document.forms[x];
    return f.ChkZone && f.ChkZone.checked ? PerChan(getNumber(f.Zone1)) + 1 : 1;
}

function cCombo(x) {
    var f = document.forms[x];
    return f.ChkCombo && f.ChkCombo.checked ? PerChan(getNumber(f.Combo1) - 100) + 1 : 1;
}

function cBreak(x) {
    var f = document.forms[x];
    if (f.Break) f.Break.value = f.ChkBreak && f.ChkBreak.checked ? 100 : 0;
    return f.ChkBreak && f.ChkBreak.checked ? 2 : 1;
}

function cOverCri(x) {
    var f = document.forms[x];
    if (f.OverCri) f.OverCri.value = f.ChkOverCri && f.ChkOverCri.checked ? 100 : 0;
    return f.ChkOverCri && f.ChkOverCri.checked ? 2 : 1;
}

function cSingle(x) {
    var f = document.forms[x];
    return f.ChkSingle && f.ChkSingle.checked ? 1.1 : 1;
}

function cMulti(x) {
    var f = document.forms[x];
    var hit = parseInt(f.Multi1.value) || 1;
    var cal = 1;
    if (f.ChkMulti && f.ChkMulti.checked) {
        switch(hit) {
            case 2: cal = 1.25; break;
            case 3: cal = 1.5; break;
            case 4: cal = 2; break;
            case 5: cal = 3; break;
        }
    }
    if (f.Multi) f.Multi.value = cal;
    return cal;
}

function cDbs(x) {
    var f = document.forms[x];
    return f.ChkDbs && f.ChkDbs.checked ? PerChan(Math.max(getNumber(f.Dbs1), 0)) + 1 : 1;
}

function cBarrier(x) {
    var f = document.forms[x];
    return f.ChkBarrier && f.ChkBarrier.checked ? PerChan(Math.max(getNumber(f.Barrier1), 0)) : 0;
}

function cOoAf(x) {
    var f = document.forms[x];
    return f.ChkOoAf && f.ChkOoAf.checked ? PerChan(Math.max(getNumber(f.OoAf1), 0)) + 1 : 1;
}

function cTenmei(x) {
    var f = document.forms[x];
    return f.ChkTenmei && f.ChkTenmei.checked ? PerChan(Math.max(getNumber(f.Tenmei1), 0)) + 1 : 1;
}

function cAZ(x) {
    var f = document.forms[x];
    return f.ChkAZ && f.ChkAZ.checked ? PerChan(Math.max(getNumber(f.AZ1), 0)) + 1 : 1;
}

function cZoneDmg(x) {
    var f = document.forms[x];
    return f.ChkZoneDmg && f.ChkZoneDmg.checked ? PerChan(Math.max(getNumber(f.ZoneDmg1), 0)) + 1 : 1;
}

function cAura(x) {
    var f = document.forms[x];
    var up = f.ChkAuraUp && f.ChkAuraUp.checked ? Diminish([getNumber(f.AuraUp1), getNumber(f.AuraUp2), getNumber(f.AuraUp3)]) : 0;
    var down = f.ChkAuraDown && f.ChkAuraDown.checked ? getNumber(f.AuraDown1) : 0;
    var cal = up - down;
    if (f.Aura) f.Aura.value = PerOut(cal);
    if (!((f.ChkAuraUp && f.ChkAuraUp.checked) || (f.ChkAuraDown && f.ChkAuraDown.checked))) return 1;
    return PerChan(cal) + 1;
}

function cEnv(x) {
    var f = document.forms[x];
    var up = f.ChkEnvUp && f.ChkEnvUp.checked ? getNumber(f.EnvUp1) : 0;
    var down = f.ChkEnvDown && f.ChkEnvDown.checked ? getNumber(f.EnvDown1) : 0;
    var cal = up - down;
    if (f.Env) f.Env.value = PerOut(cal);
    if (!((f.ChkEnvUp && f.ChkEnvUp.checked) || (f.ChkEnvDown && f.ChkEnvDown.checked))) return 1;
    return PerChan(cal) + 1;
}

function cEagle(x) {
    var f = document.forms[x];
    return f.ChkEagle && f.ChkEagle.checked ? PerChan(Math.max(getNumber(f.Eagle1), 0)) : 0;
}

function cOverthrow(x) {
    var f = document.forms[x];
    var C = GAME_CONSTANTS;
    if (!f.ChkOverthrow || !f.ChkOverthrow.checked) {
        if (f.Overthrow) f.Overthrow.value = '0.0';
        return 0;
    }
    var level = getValue(f.EneLv);
    var cal = Math.min(Math.pow(level, 2) / C.OVERTHROW_DIVISOR_NORMAL, C.BUFF_CAP);
    if (f.Overthrow) f.Overthrow.value = PerOut(cal);
    return PerChan(cal);
}

function cOverthrowEq(x) {
    var f = document.forms[x];
    var C = GAME_CONSTANTS;
    if (!f.ChkOverthrowEq || !f.ChkOverthrowEq.checked) {
        if (f.OverthrowEq) f.OverthrowEq.value = '0.0';
        return 1;
    }
    var level = getValue(f.EneLv);
    var type = f.OverthrowEqType ? f.OverthrowEqType.value : 'mujima';
    var divisor = (type === 'elpis') ? C.OVERTHROW_DIVISOR_ELPIS : C.OVERTHROW_DIVISOR_MUJIMA;
    var cal = Math.min(Math.pow(level, 2) / divisor, C.BUFF_CAP);
    if (f.OverthrowEq) f.OverthrowEq.value = PerOut(cal);
    return PerChan(cal) + 1;
}

function cShingittai(x) {
    var f = document.forms[x];
    var C = GAME_CONSTANTS;
    if (!f.ChkShingittai || !f.ChkShingittai.checked) {
        if (f.Shingittai) f.Shingittai.value = '0.0';
        return 0;
    }
    var mp = getValue(f.Mp);
    var cal = Math.min(mp * C.SHINGITTAI_RATE, C.MENTAL_CAP);
    if (f.Shingittai) f.Shingittai.value = PerOut(cal);
    return PerChan(cal);
}

function cMental(x, no) {
    var f = document.forms[x];
    var C = GAME_CONSTANTS;
    var elems = f.getElementsByClassName('mental-in');
    var out = f.getElementsByClassName('mental-out');
    if (!elems || elems.length <= no) return 0;
    if (!f.ChkMental || !f.ChkMental.checked) {
        if (out && out[no]) out[no].value = '0.0';
        return 0;
    }
    var mp = getValue(f.Mp);
    var rate = getNumber(elems[no]);
    var cal = Math.min(rate * mp, C.MENTAL_CAP);
    if (out && out[no]) out[no].value = PerOut(cal);
    return PerChan(cal);
}

function cPurplePhy(x) {
    var C = GAME_CONSTANTS;
    var cal = Diminish([cEagle(x)*100, cOverthrow(x)*100, cShingittai(x)*100]);
    cal = Math.min(cal, C.PURPLE_BUFF_CAP);
    return PerChan(cal) + 1;
}

function cPurpleMag(x) {
    var C = GAME_CONSTANTS;
    var cal = Diminish([cEagle(x)*100, cOverthrow(x)*100, cMental(x,0)*100]);
    cal = Math.min(cal, C.PURPLE_BUFF_CAP);
    return PerChan(cal) + 1;
}

function cGrowUp(x) {
    var f = document.forms[x];
    return f.ChkGrowUp && f.ChkGrowUp.checked ? PerChan(Math.max(getNumber(f.GrowUp1), 0)) + 1 : 1;
}

function cGrowDown(x) {
    var f = document.forms[x];
    return f.ChkGrowDown && f.ChkGrowDown.checked ? PerChan(Math.max(getNumber(f.GrowDown1), 0)) : 0;
}

function cSing(x) {
    var f = document.forms[x];
    return f.ChkSing && f.ChkSing.checked ? PerChan(getNumber(f.Sing1)) + 1 : 1;
}

function cPray(x) {
    var f = document.forms[x];
    return f.ChkPray && f.ChkPray.checked ? PerChan(getNumber(f.Pray1)) + 1 : 1;
}

function cEneNum(x) {
    var f = document.forms[x];
    if (!f.ChkEneNum || !f.ChkEneNum.checked) {
        if (f.EneNum) f.EneNum.value = 0;
        return 1;
    }
    var amount = getValue(f.EneNum1);
    var rate = getNumber(f.EneNum2);
    var cal = Math.max((amount - 1) * rate, 0);
    if (f.EneNum) f.EneNum.value = cal;
    return PerChan(cal) + 1;
}

function cMpCost(x) {
    var f = document.forms[x];
    return f.ChkMpCost && f.ChkMpCost.checked ? PerChan(Math.max(getNumber(f.MpCost1), 0)) + 1 : 1;
}

function cDespair(x) {
    var f = document.forms[x];
    if (!f.ChkDespair || !f.ChkDespair.checked) {
        if (f.Despair) f.Despair.value = 0;
        return 1;
    }
    var amount = getValue(f.Despair1);
    var rate = getNumber(f.Despair2);
    var cal = amount * rate;
    if (f.Despair) f.Despair.value = cal;
    return PerChan(cal) + 1;
}

function cFree(x, no) {
    var f = document.forms[x];
    var elems = f.getElementsByClassName('free-in');
    if (!elems || elems.length <= no) return 1;
    var val = getNumber(elems[no]);
    return f.ChkFree && f.ChkFree.checked ? PerChan(Math.max(val, -100)) + 1 : 1;
}

function cPP(x, no) {
    var f = document.forms[x];
    var elems = f.getElementsByClassName('pp-in');
    if (!elems || elems.length <= no) return 1;
    var val = getNumber(elems[no]);
    return f.ChkPP && f.ChkPP.checked && val >= 0 ? PerChan(val) + 1 : 1;
}

function cPPEq(x, no) {
    var f = document.forms[x];
    var elems = f.getElementsByClassName('pp-eq-in');
    if (!elems || elems.length <= no) return 1;
    var val = getNumber(elems[no]);
    return f.ChkPPEq && f.ChkPPEq.checked && val >= 0 ? PerChan(val) + 1 : 1;
}

function cSelfPP(x, no) {
    var f = document.forms[x];
    var elems = f.getElementsByClassName('self-pp-in');
    if (!elems || elems.length <= no) return 1;
    var val = getNumber(elems[no]);
    return f.ChkSelfPP && f.ChkSelfPP.checked && val >= 0 ? PerChan(val) + 1 : 1;
}

function cLuna1Edr(x) {
    var f = document.forms[x];
    return f.ChkLuna1 && f.ChkLuna1.checked ? getValue(f.Luna1Edr) : 0;
}

function cLuna1Spr(x) {
    var f = document.forms[x];
    return f.ChkLuna1 && f.ChkLuna1.checked ? getValue(f.Luna1Spr) : 0;
}

function cLuna2(x) {
    var f = document.forms[x];
    return f.ChkLuna2 && f.ChkLuna2.checked ? PerChan(70) + 1 : 1;
}

function cLuna3(x) {
    var f = document.forms[x];
    return f.ChkLuna3 && f.ChkLuna3.checked ? PerChan(50) + 1 : 1;
}

function cLuna3Weak(x) {
    var f = document.forms[x];
    return f.ChkLuna3 && f.ChkLuna3.checked ? 1 : 0;
}

function cPwrUp(x) {
    var f = document.forms[x];
    return f.ChkPwrUp && f.ChkPwrUp.checked ? getValue(f.PwrUp) : 0;
}

function cItgUp(x) {
    var f = document.forms[x];
    return f.ChkItgUp && f.ChkItgUp.checked ? getValue(f.ItgUp) : 0;
}

function cMod(x) {
    return Math.max(getNumber(document.forms[x].Mod), 0) / 100;
}
