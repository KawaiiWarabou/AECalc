// ============================================
// 共有機能（URL/テキスト/画像）
// ============================================

// URL共有機能
function shareState(formName) {
    var form = document.forms[formName];
    var data = {};

    // デフォルト値を除外して非デフォルト値のみ保存（データ量削減）
    var inputs = form.querySelectorAll('input[type="number"], input[type="checkbox"], select');
    inputs.forEach(function(input) {
        if (input.name) {
            if (input.type === 'checkbox') {
                // チェックされている場合のみ保存（デフォルトはfalse）
                if (input.checked) {
                    data[input.name] = 1; // trueを1で表現（短縮）
                }
            } else {
                // 0や空文字以外の値のみ保存
                var val = input.value;
                if (val !== '' && val !== '0' && val !== '100') {
                    data[input.name] = val;
                } else if (val === '100' && input.name === 'Mod') {
                    // Mod=100はデフォルトなので保存しない
                } else if (val === '100') {
                    data[input.name] = val;
                }
            }
        }
    });

    // LZ圧縮でエンコード（URL safe）
    var jsonStr = JSON.stringify(data);
    var compressed = LZString.compressToEncodedURIComponent(jsonStr);

    // URLを生成（v=2で圧縮形式を示す）
    var baseUrl = window.location.origin + window.location.pathname;
    var shareUrl = baseUrl + '?f=' + (formName === 'PhysicP' ? 'P' : 'M') + '&v=2&d=' + compressed;

    // クリップボードにコピー
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(function() {
            alert(t('share.urlCopied'));
        }).catch(function(err) {
            // フォールバック：テキストエリアを使用
            copyToClipboardFallback(shareUrl);
        });
    } else {
        // 古いブラウザ用のフォールバック
        copyToClipboardFallback(shareUrl);
    }
}

function copyToClipboardFallback(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert(t('share.urlCopied'));
    } catch (err) {
        alert(t('share.copyFailed') + text);
    }
    document.body.removeChild(textarea);
}

function loadFromURL() {
    var urlParams = new URLSearchParams(window.location.search);

    // 新形式（v=2）をチェック
    var version = urlParams.get('v');
    var formShort = urlParams.get('f');
    var compressed = urlParams.get('d');

    // 旧形式のパラメータ
    var formNameOld = urlParams.get('form');
    var encodedOld = urlParams.get('data');

    var formName, data;

    try {
        if (version === '2' && formShort && compressed) {
            // 新形式：LZ圧縮
            formName = formShort === 'P' ? 'PhysicP' : 'MagicI';
            var jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
            if (!jsonStr) {
                throw new Error(t('share.decompressFailed'));
            }
            data = JSON.parse(jsonStr);
        } else if (formNameOld && encodedOld) {
            // 旧形式：Base64（後方互換性）
            formName = formNameOld;
            var jsonStr = decodeURIComponent(escape(atob(encodedOld)));
            data = JSON.parse(jsonStr);
        } else {
            // URLパラメータなし
            return;
        }

        // 対象フォームを表示
        if (formName === 'PhysicP') {
            switchTab('physical');
        } else if (formName === 'MagicI') {
            switchTab('magic');
        }

        var form = document.forms[formName];
        if (!form) {
            alert(t('share.formNotFound'));
            return;
        }

        // 全入力要素に値を復元
        for (var key in data) {
            var input = form.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    // 新形式では1=true、旧形式ではtrue/false
                    input.checked = data[key] === 1 || data[key] === true;
                } else {
                    input.value = data[key];
                }
            }
        }

        // 計算を実行
        var config = (formName === FORM_CONFIG.MAGIC.name) ? FORM_CONFIG.MAGIC : FORM_CONFIG.PHYSICAL;
        calculate(formName, config.type, config.base);

        // URLパラメータをクリア（履歴を汚さないように）
        if (window.history && window.history.replaceState) {
            var cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        alert(t('share.urlLoaded'));
    } catch (err) {
        alert(t('share.loadFailed') + err.message);
    }
}

// テキスト共有機能
function shareAsText(formName) {
    try {
        var form = document.forms[formName];
        if (!form) {
            alert(t('share.formNotFound') + ': ' + formName);
            return;
        }

        var calcType = formName === 'PhysicP' ? t('tabs.physical') : t('tabs.magic');
        var text = t('share.resultTitle') + '\n';
        text += t('share.calcType') + ': ' + calcType + '\n\n';

        // ダメージ計算結果を最初に表示
        text += t('share.damageResults') + '\n';
        var results = [
            {id: formName + '_EleNor', label: t('share.eleNormalNormal')},
            {id: formName + '_EleNorCri', label: t('share.eleNormalCritical')},
            {id: formName + '_EleWeak', label: t('share.eleWeakNormal')},
            {id: formName + '_EleWeakCri', label: t('share.eleWeakCritical')},
            {id: formName + '_Nor', label: t('share.nonEleNormalNormal')},
            {id: formName + '_NorCri', label: t('share.nonEleNormalCritical')},
            {id: formName + '_Weak', label: t('share.nonEleWeakNormal')},
            {id: formName + '_WeakCri', label: t('share.nonEleWeakCritical')}
        ];

        results.forEach(function(result) {
            var elem = document.getElementById(result.id);
            if (elem) {
                var dmgText = formatDamageForText(elem);
                if (dmgText) {
                    text += result.label + ': ' + dmgText + '\n';
                }
            }
        });

        // 主要ステータス
        text += '\n' + t('share.statusSection') + '\n';
        var stats;
        if (formName === 'PhysicP') {
            stats = [
                {name: 'Pwr', label: t('stats.power')},
                {name: 'Itg', label: t('stats.intelligence')},
                {name: 'Mp', label: t('stats.mp')},
                {name: 'WpPhyAtk', label: t('stats.weaponPhyAtk')},
                {name: 'WpMagAtk', label: t('stats.weaponMagAtk')},
                {name: 'PhyDef', label: t('stats.defense')},
                {name: 'EneLv', label: t('stats.level')},
                {name: 'Mod', label: t('stats.skillPower')}
            ];
        } else {
            stats = [
                {name: 'Itg', label: t('stats.intelligence')},
                {name: 'Mp', label: t('stats.mp')},
                {name: 'WpMagAtk', label: t('stats.weaponMagAtk')},
                {name: 'PhyDef', label: t('stats.magicDefense')},
                {name: 'EneLv', label: t('stats.level')},
                {name: 'Mod', label: t('stats.skillPower')}
            ];
        }

        stats.forEach(function(stat) {
            var elem = form.elements[stat.name];
            var value = elem ? elem.value : '0';
            if (value && value !== '0' && value !== '') {
                text += stat.label + ': ' + value + '\n';
            }
        });

        // バフ・デバフの計算結果をカテゴリ分けして表示
        var buffResults = collectBuffResults(formName, form);

        // 装備効果
        if (buffResults.equipment && buffResults.equipment.length > 0) {
            text += '\n' + t('share.equipmentSection') + '\n';
            buffResults.equipment.forEach(function(buff) {
                text += buff + '\n';
            });
        }

        // ダメージ補正
        if (buffResults.basicBuffs && buffResults.basicBuffs.length > 0) {
            text += '\n' + t('share.buffsSection') + '\n';
            buffResults.basicBuffs.forEach(function(buff) {
                text += buff + '\n';
            });
        }

        // 特殊バフ・コンボなど
        if (buffResults.specialBuffs && buffResults.specialBuffs.length > 0) {
            text += '\n' + t('share.specialSection') + '\n';
            buffResults.specialBuffs.forEach(function(buff) {
                text += buff + '\n';
            });
        }

        // オーラ/環境効果
        if (buffResults.environment && buffResults.environment.length > 0) {
            text += '\n' + t('share.auraSection') + '\n';
            buffResults.environment.forEach(function(buff) {
                text += buff + '\n';
            });
        }

        // ツール情報
        text += '\n---\n';
        text += t('share.toolCredit') + ' ' + t('share.toolUrl') + '\n';

        // クリップボードにコピー
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                alert(t('share.textCopied'));
            }).catch(function(err) {
                copyToClipboardFallback(text);
            });
        } else {
            copyToClipboardFallback(text);
        }
    } catch (err) {
        alert(t('share.textFailed') + err.message);
        console.error('shareAsText error:', err);
    }
}

// ダメージ表示をテキスト用にフォーマット
function formatDamageForText(elem) {
    var html = elem.innerHTML;
    if (!html) return null;

    // 内部ダメージと減衰後ダメージの両方がある場合（翻訳対応）
    var internalLabel = t('results.internalDamage');
    var reducedLabel = t('results.reducedDamage');

    // 翻訳されたラベルでマッチングするために正規表現を動的に生成
    var internalPattern = new RegExp(internalLabel + '：([^<]+)');
    var actualPattern = new RegExp(reducedLabel + '：([^<]+)');

    var internalMatch = html.match(internalPattern);
    var actualMatch = html.match(actualPattern);

    if (internalMatch && actualMatch) {
        return actualMatch[1] + '(' + internalLabel + '：' + internalMatch[1] + ')';
    }

    // 通常のダメージ表示
    return elem.textContent.trim();
}

// バフ・デバフの計算結果を収集（カテゴリ分け）
function collectBuffResults(formName, form) {
    var results = {
        equipment: [],
        basicBuffs: [],
        specialBuffs: [],
        environment: []
    };

    // 装備効果
    var equipmentBuffs = [
        {check: 'ChkEleBfEq', label: t('equipment.elementalBuff'), inputs: ['EleBfEq1']},
        {check: 'ChkHpBfEq', label: t('equipment.hpCondition'), inputs: ['HpBfEq1']},
        {check: 'ChkPPEq', label: t('equipment.statusAilment'), special: 'PPEq'},
        {check: 'ChkWeak', label: t('equipment.weaknessEnhance'), inputs: ['Weak1']},
        {check: 'ChkMpCost', label: t('equipment.mpCostAttack'), inputs: ['MpCost1']},
        {check: 'ChkOoAf', label: t('equipment.targetAim'), inputs: ['OoAf1']},
        {check: 'ChkEneNum', label: t('equipment.enemyCount'), special: 'EneNum'},
        {check: 'ChkTenmei', label: t('equipment.lightShadow'), inputs: ['Tenmei1']},
        {check: 'ChkDbs', label: t('equipment.statusEnhance'), inputs: ['Dbs1']},
        {check: 'ChkOverthrowEq', label: t('equipment.overthrowEquip'), output: 'OverthrowEq'},
        {check: 'ChkGrowUp', label: t('equipment.damageGrowth'), inputs: ['GrowUp1']},
        {check: 'ChkGrowDown', label: t('equipment.damageReductionGrowth'), inputs: ['GrowDown1']},
        {check: 'ChkDespair', label: t('equipment.despairPower'), special: 'Despair'}
    ];
    processBuffCategory(equipmentBuffs, formName, form, results.equipment);

    // ダメージ補正
    var basicBuffs = [
        {check: 'ChkPwrBf', label: t('buffs.powerBuff'), inputs: ['PwrBf1', 'PwrBf2', 'PwrBf3'], showFor: 'PhysicP'},
        {check: 'ChkItgBf', label: t('buffs.intelligenceBuff'), inputs: ['ItgBf1', 'ItgBf2', 'ItgBf3']},
        {check: 'ChkPhyRDb', label: t('buffs.physicalResDebuff'), inputs: ['PhyRDb1', 'PhyRDb2', 'PhyRDb3'], showFor: 'PhysicP'},
        {check: 'ChkMagRDb', label: t('buffs.magicalResDebuff'), inputs: ['MagRDb1', 'MagRDb2', 'MagRDb3'], showFor: 'MagicI'},
        {check: 'ChkEleRDb', label: t('buffs.elementalResDebuff'), inputs: ['EleRDb1', 'EleRDb2', 'EleRDb3']},
        {check: 'ChkWpBf', label: t('buffs.weaponTypeBuff'), inputs: ['WpBf1', 'WpBf2', 'WpBf3']},
        {check: 'ChkEleBf', label: t('buffs.elementalBuff'), inputs: ['EleBf1', 'EleBf2', 'EleBf3']},
        {check: 'ChkCriBf', label: t('buffs.criticalDamageBuff'), inputs: ['CriBf1']},
        {check: 'ChkShingittai', label: t('buffs.shingittai'), output: 'Shingittai', showFor: 'PhysicP'},
        {check: 'ChkMental', label: t('buffs.mental'), output: 'Mental', showFor: 'MagicI'},
        {check: 'ChkEagle', label: t('buffs.eagle'), inputs: ['Eagle1']},
        {check: 'ChkOverthrow', label: t('buffs.overthrow'), output: 'Overthrow'},
        {check: 'ChkBreak', label: t('buffs.break'), output: 'Break'},
        {check: 'ChkOverCri', label: t('buffs.overCritical'), output: 'OverCri'},
        {check: 'ChkFree', label: t('buffs.freeSlot'), inputs: ['Free1', 'Free2', 'Free3', 'Free4', 'Free5', 'Free6']}
    ];
    processBuffCategory(basicBuffs, formName, form, results.basicBuffs);

    // 特殊バフ・コンボなど
    var specialBuffs = [
        {check: 'ChkLuna1', label: t('special.teishin'), special: 'Luna1'},
        {check: 'ChkLuna2', label: t('special.shashin'), special: 'fixed', value: '+70%'},
        {check: 'ChkLuna3', label: t('special.shingan'), special: 'fixed', value: '+50%, ' + t('special.weaknessMultiplier') + '+1'},
        {check: 'ChkMulti', label: t('special.multiHit'), special: 'Multi'},
        {check: 'ChkWeakBf', label: t('special.weaknessDamageUp'), special: 'WeakBf'},
        {check: 'ChkCombo', label: t('special.combo'), inputs: ['Combo1']},
        {check: 'ChkSing', label: t('special.sing'), inputs: ['Sing1']},
        {check: 'ChkPray', label: t('special.pray'), inputs: ['Pray1']},
        {check: 'ChkZone', label: t('special.zone'), inputs: ['Zone1']},
        {check: 'ChkZoneDmg', label: t('special.zoneDamageUp'), inputs: ['ZoneDmg1']},
        {check: 'ChkAZ', label: t('special.azEnhance'), inputs: ['AZ1']},
        {check: 'ChkPwrUp', label: t('special.statFixedIncrease'), special: 'PwrUp', showFor: 'PhysicP'},
        {check: 'ChkItgUp', label: t('special.statFixedIncrease'), special: 'ItgUp', showFor: 'MagicI'}
    ];
    processBuffCategory(specialBuffs, formName, form, results.specialBuffs);

    // オーラ/環境効果
    var environmentBuffs = [
        {check: 'ChkAuraUp', label: t('aura.auraIncrease'), inputs: ['AuraUp1', 'AuraUp2', 'AuraUp3']},
        {check: 'ChkEnvUp', label: t('aura.envIncrease'), inputs: ['EnvUp1']}
    ];
    processBuffCategory(environmentBuffs, formName, form, results.environment);

    return results;
}

// バフカテゴリの処理
function processBuffCategory(buffList, formName, form, targetArray) {
    buffList.forEach(function(buff) {
        try {
            // フォーム固有のバフをスキップ
            if (buff.showFor && buff.showFor !== formName) return;

            var checkbox = form.elements[buff.check];
            if (checkbox && checkbox.checked) {
                // 特別処理が必要なバフ
                if (buff.special === 'PPEq') {
                    // 状態異常強化の特別処理
                    var ppValues = [];
                    for (var i = 1; i <= 6; i++) {
                        var elem = form.elements['PPEq' + i];
                        if (elem && elem.value && elem.value !== '0' && elem.value !== '') {
                            ppValues.push(elem.value);
                        }
                    }
                    if (ppValues.length > 0) {
                        targetArray.push(buff.label + ': ' + ppValues.join('/') + '%');
                    }
                } else if (buff.special === 'EneNum') {
                    // てきのかず
                    var num = form.elements['EneNum1'] ? form.elements['EneNum1'].value : '1';
                    var pct = form.elements['EneNum2'] ? form.elements['EneNum2'].value : '30';
                    var result = form.elements['EneNum'] ? form.elements['EneNum'].value : '0';
                    targetArray.push(buff.label + ': ' + t('equipment.enemyCountNum') + num + '×' + pct + '%=' + result + '%');
                } else if (buff.special === 'Despair') {
                    // 絶望の力
                    var num = form.elements['Despair1'] ? form.elements['Despair1'].value : '0';
                    var pct = form.elements['Despair2'] ? form.elements['Despair2'].value : '100';
                    var result = form.elements['Despair'] ? form.elements['Despair'].value : '0';
                    targetArray.push(buff.label + ': ' + t('equipment.despairCount') + num + '×' + pct + '=' + result + '%');
                } else if (buff.special === 'Luna1') {
                    // 挺身
                    if (formName === 'PhysicP') {
                        var edr = form.elements['Luna1Edr'] ? form.elements['Luna1Edr'].value : '200';
                        var spr = form.elements['Luna1Spr'] ? form.elements['Luna1Spr'].value : '200';
                        targetArray.push(buff.label + ': ' + t('stats.power') + '+' + edr + '/' + t('stats.intelligence') + '+' + spr);
                    } else {
                        var spr = form.elements['Luna1Spr'] ? form.elements['Luna1Spr'].value : '200';
                        targetArray.push(buff.label + ': ' + t('stats.intelligence') + '+' + spr);
                    }
                } else if (buff.special === 'Multi') {
                    // 多段強化
                    var multi = form.elements['Multi1'] ? form.elements['Multi1'].value : '1';
                    var result = form.elements['Multi'] ? form.elements['Multi'].value : '1';
                    targetArray.push(buff.label + ': ' + multi + t('special.multiHitCount') + result);
                } else if (buff.special === 'PwrUp') {
                    // 能力固定値上昇(腕力)
                    var pwr = form.elements['PwrUp'] ? form.elements['PwrUp'].value : '0';
                    var itg = form.elements['ItgUp'] ? form.elements['ItgUp'].value : '0';
                    if (pwr && pwr !== '0' && pwr !== '') {
                        targetArray.push(buff.label + ': ' + t('special.powerUp') + '+' + pwr);
                    }
                    if (itg && itg !== '0' && itg !== '') {
                        targetArray.push(buff.label + ': ' + t('special.intelligenceUp') + '+' + itg);
                    }
                } else if (buff.special === 'ItgUp') {
                    // 能力固定値上昇(知性)
                    var itg = form.elements['ItgUp'] ? form.elements['ItgUp'].value : '0';
                    if (itg && itg !== '0' && itg !== '') {
                        targetArray.push(buff.label + ': ' + t('special.intelligenceUp') + '+' + itg);
                    }
                } else if (buff.special === 'WeakBf') {
                    // 弱点ダメージアップ - 弱点倍率+の形式
                    var val = form.elements['WeakBf1'] ? form.elements['WeakBf1'].value : '0';
                    if (val && val !== '0' && val !== '') {
                        targetArray.push(buff.label + ': ' + t('special.weaknessMultiplier') + '+' + val);
                    }
                } else if (buff.special === 'fixed') {
                    // 固定値バフ（捨身、心眼など）
                    targetArray.push(buff.label + ': ' + buff.value);
                } else if (buff.output) {
                    // outputタグから計算結果を読み取る
                    var outputElem = form.elements[buff.output];
                    if (outputElem && outputElem.value) {
                        var val = outputElem.value;
                        if (val && val !== '0' && val !== '0.0') {
                            targetArray.push(buff.label + ': +' + val + '%');
                        }
                    }
                } else if (buff.inputs && buff.inputs.length > 0) {
                    // 通常の入力値があるバフ
                    var inputValues = [];
                    buff.inputs.forEach(function(inputName) {
                        var elem = form.elements[inputName];
                        if (elem && elem.value && elem.value !== '0' && elem.value !== '') {
                            inputValues.push(elem.value);
                        }
                    });
                    if (inputValues.length > 0) {
                        targetArray.push(buff.label + ': ' + inputValues.join('/') + '%');
                    }
                }
            }
        } catch (err) {
            console.error('バフ処理エラー (' + buff.label + '):', err);
        }
    });
}

// チェックボックスに対応するラベルを探す
function findLabelText(checkbox) {
    var parent = checkbox.closest('.buff-row');
    if (!parent) return null;

    var label = parent.querySelector('.buff-label');
    if (label) {
        return label.textContent.trim();
    }

    // その他のラベル探索
    var span = parent.querySelector('span:not(.slider)');
    if (span) {
        return span.textContent.trim();
    }

    return null;
}

// 画像共有機能
function shareAsImage(formName) {
    try {
        var form = document.forms[formName];
        if (!form) {
            alert(t('share.formNotFound') + ': ' + formName);
            return;
        }

        // テキスト共有と同じ内容を取得
        var calcType = formName === 'PhysicP' ? t('tabs.physical') : t('tabs.magic');

        // Canvasを作成
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // 画像サイズ（高解像度）
        var width = 1200;
        canvas.width = width;

        // 描画内容を準備
        var content = prepareImageContent(formName, form, calcType);

        // 必要な高さを計算
        var height = calculateCanvasHeight(content);
        canvas.height = height;

        // 背景グラデーション
        var gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 描画
        drawImageContent(ctx, content, width);

        // 画像をダウンロード
        canvas.toBlob(function(blob) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'anaden_damage_calc_' + calcType + '_' + Date.now() + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(t('share.imageSaved'));
        });
    } catch (err) {
        alert(t('share.imageFailed') + err.message);
        console.error('shareAsImage error:', err);
    }
}

// 画像用のコンテンツを準備
function prepareImageContent(formName, form, calcType) {
    var content = {
        title: t('share.resultTitle'),
        calcType: t('share.calcType') + ': ' + calcType,
        results: [],
        stats: [],
        buffs: {
            equipment: [],
            basicBuffs: [],
            specialBuffs: [],
            environment: []
        }
    };

    // ダメージ結果を取得
    var results = [
        {id: formName + '_EleNorCri', label: t('share.eleNormalCritical')},
        {id: formName + '_EleWeakCri', label: t('share.eleWeakCritical')},
        {id: formName + '_NorCri', label: t('share.nonEleNormalCritical')},
        {id: formName + '_WeakCri', label: t('share.nonEleWeakCritical')}
    ];

    results.forEach(function(result) {
        var elem = document.getElementById(result.id);
        if (elem) {
            var dmgText = formatDamageForText(elem);
            if (dmgText) {
                content.results.push({label: result.label, value: dmgText});
            }
        }
    });

    // ステータスを取得
    var stats;
    if (formName === 'PhysicP') {
        stats = [
            {name: 'Pwr', label: t('stats.power')},
            {name: 'Itg', label: t('stats.intelligence')},
            {name: 'Mp', label: t('stats.mp')},
            {name: 'WpPhyAtk', label: t('stats.weaponPhyAtk')},
            {name: 'WpMagAtk', label: t('stats.weaponMagAtk')},
            {name: 'PhyDef', label: t('stats.defense')},
            {name: 'EneLv', label: t('stats.level')},
            {name: 'Mod', label: t('stats.skillPower')}
        ];
    } else {
        stats = [
            {name: 'Itg', label: t('stats.intelligence')},
            {name: 'Mp', label: t('stats.mp')},
            {name: 'WpMagAtk', label: t('stats.weaponMagAtk')},
            {name: 'PhyDef', label: t('stats.magicDefense')},
            {name: 'EneLv', label: t('stats.level')},
            {name: 'Mod', label: t('stats.skillPower')}
        ];
    }

    stats.forEach(function(stat) {
        var elem = form.elements[stat.name];
        var value = elem ? elem.value : '0';
        if (value && value !== '0' && value !== '') {
            content.stats.push({label: stat.label, value: value});
        }
    });

    // バフを取得
    var buffResults = collectBuffResults(formName, form);
    content.buffs = buffResults;

    return content;
}

// Canvas描画に必要な高さを計算
function calculateCanvasHeight(content) {
    var height = 180; // ヘッダー
    height += 300; // ダメージ結果テーブル
    height += Math.ceil(content.stats.length / 3) * 45 + 80; // ステータス（3カラム）

    // バフセクション（2カラム、コンパクト）
    if (content.buffs.equipment.length > 0) {
        height += Math.ceil(content.buffs.equipment.length / 2) * 32 + 70;
    }
    if (content.buffs.basicBuffs.length > 0) {
        height += Math.ceil(content.buffs.basicBuffs.length / 2) * 32 + 70;
    }
    if (content.buffs.specialBuffs.length > 0) {
        height += Math.ceil(content.buffs.specialBuffs.length / 2) * 32 + 70;
    }
    if (content.buffs.environment.length > 0) {
        height += Math.ceil(content.buffs.environment.length / 2) * 32 + 70;
    }

    height += 100; // フッター余白 + ツール情報

    return Math.min(height, 4000); // 最大4000px
}

// Canvasに描画
function drawImageContent(ctx, content, width) {
    var y = 50;
    var padding = 40;
    var innerPadding = 20;

    // ヘッダー - タイトルボックス
    ctx.fillStyle = '#0d6efd';
    ctx.fillRect(0, 0, width, 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(content.title, width / 2, 65);

    ctx.font = '32px "Noto Sans JP", sans-serif';
    ctx.fillText(content.calcType, width / 2, 115);

    y = 170;

    // ダメージ計算結果 - 表形式
    y = drawDamageTable(ctx, content.results, y, width, padding);
    y += 30;

    // ステータス・威力 - 3カラムグリッド
    y = drawStatsGrid(ctx, content.stats, y, width, padding, innerPadding);
    y += 30;

    // 装備効果 - 2カラムコンパクト
    if (content.buffs.equipment.length > 0) {
        y = drawBuffSection(ctx, t('sections.equipment'), content.buffs.equipment, y, width, padding, innerPadding, '#d1e7dd', '#198754');
        y += 20;
    }

    // ダメージ補正 - 2カラムコンパクト
    if (content.buffs.basicBuffs.length > 0) {
        y = drawBuffSection(ctx, t('sections.damageModifiers'), content.buffs.basicBuffs, y, width, padding, innerPadding, '#cfe2ff', '#0d6efd');
        y += 20;
    }

    // 特殊バフ - 2カラムコンパクト
    if (content.buffs.specialBuffs.length > 0) {
        y = drawBuffSection(ctx, t('sections.specialBuffs'), content.buffs.specialBuffs, y, width, padding, innerPadding, '#e0cffc', '#6f42c1');
        y += 20;
    }

    // オーラ/環境効果 - 2カラムコンパクト
    if (content.buffs.environment.length > 0) {
        y = drawBuffSection(ctx, t('sections.auraEnvironment'), content.buffs.environment, y, width, padding, innerPadding, '#e0cffc', '#6f42c1');
        y += 20;
    }

    // フッター - ツール情報
    y += 20;
    ctx.fillStyle = '#6c757d';
    ctx.font = '20px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('share.toolCredit') + ' ' + t('share.toolUrl'), width / 2, y);
}

// ダメージ計算結果をテーブル形式で描画
function drawDamageTable(ctx, results, y, width, padding) {
    var boxX = padding;
    var boxWidth = width - padding * 2;
    var boxHeight = 60 + results.length * 55;

    // セクション背景
    ctx.fillStyle = '#fff5f5';
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.fill();

    // セクション枠線
    ctx.strokeStyle = '#dc3545';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.stroke();

    // タイトル
    ctx.fillStyle = '#dc3545';
    ctx.font = 'bold 32px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('■ ' + t('share.damageResults').replace('■ ', ''), boxX + 20, y + 40);

    // テーブルヘッダー背景
    var tableY = y + 60;

    // 各結果行を描画
    results.forEach(function(result, index) {
        var rowY = tableY + index * 55;

        // 交互の背景色
        if (index % 2 === 0) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#f8f9fa';
        }
        ctx.fillRect(boxX + 10, rowY, boxWidth - 20, 50);

        // 枠線
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX + 10, rowY, boxWidth - 20, 50);

        // ラベル
        ctx.fillStyle = '#495057';
        ctx.font = '22px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(result.label, boxX + 25, rowY + 32);

        // 値（右寄せ、大きく強調）
        ctx.fillStyle = '#fd7e14';
        ctx.font = 'bold 26px "Inter", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(result.value, boxX + boxWidth - 35, rowY + 32);
    });

    return y + boxHeight;
}

// ステータスを3カラムグリッドで描画
function drawStatsGrid(ctx, stats, y, width, padding, innerPadding) {
    if (stats.length === 0) return y;

    var boxX = padding;
    var boxWidth = width - padding * 2;
    var cols = 3;
    var rows = Math.ceil(stats.length / cols);
    var boxHeight = 60 + rows * 45;

    // セクション背景
    ctx.fillStyle = '#e7f6fd';
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.fill();

    // セクション枠線
    ctx.strokeStyle = '#0dcaf0';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.stroke();

    // タイトル
    ctx.fillStyle = '#0dcaf0';
    ctx.font = 'bold 28px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('■ ' + t('share.statusSection').replace('■ ', ''), boxX + 20, y + 38);

    // グリッド描画
    var cellWidth = (boxWidth - 40) / cols;
    var startY = y + 60;

    stats.forEach(function(stat, index) {
        var col = index % cols;
        var row = Math.floor(index / cols);
        var cellX = boxX + 20 + col * cellWidth;
        var cellY = startY + row * 45;

        // ラベル
        ctx.fillStyle = '#495057';
        ctx.font = '20px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(stat.label + ':', cellX, cellY + 20);

        // 値
        ctx.fillStyle = '#212529';
        ctx.font = 'bold 22px "Inter", monospace';
        ctx.fillText(stat.value, cellX + 120, cellY + 20);
    });

    return y + boxHeight;
}

// バフセクションを2カラムコンパクトで描画
function drawBuffSection(ctx, title, buffs, y, width, padding, innerPadding, bgColor, borderColor) {
    var boxX = padding;
    var boxWidth = width - padding * 2;
    var cols = 2;
    var rows = Math.ceil(buffs.length / cols);
    var boxHeight = 60 + rows * 32;

    // セクション背景
    ctx.fillStyle = bgColor;
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.fill();

    // セクション枠線
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    roundRect(ctx, boxX, y, boxWidth, boxHeight, 12);
    ctx.stroke();

    // タイトル
    ctx.fillStyle = borderColor;
    ctx.font = 'bold 24px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('■ ' + title, boxX + 15, y + 35);

    // 2カラムでバフを描画
    var cellWidth = (boxWidth - 30) / cols;
    var startY = y + 55;

    buffs.forEach(function(buff, index) {
        var col = index % cols;
        var row = Math.floor(index / cols);
        var cellX = boxX + 15 + col * cellWidth;
        var cellY = startY + row * 32;

        // テキスト
        ctx.fillStyle = '#212529';
        ctx.font = '18px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'left';

        // 長いテキストは切り詰め
        var maxWidth = cellWidth - 20;
        var text = buff;
        var textWidth = ctx.measureText(text).width;

        if (textWidth > maxWidth) {
            while (textWidth > maxWidth && text.length > 0) {
                text = text.substring(0, text.length - 1);
                textWidth = ctx.measureText(text + '...').width;
            }
            text = text + '...';
        }

        ctx.fillText(text, cellX, cellY + 16);
    });

    return y + boxHeight;
}

// 角丸矩形を描画するヘルパー関数
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}
