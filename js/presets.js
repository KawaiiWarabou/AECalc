// ============================================
// プリセット管理機能
// ============================================

/**
 * プリセット用のlocalStorageキーを取得
 * @param {string} formName - フォーム名
 * @return {string} ストレージキー
 */
function getStorageKey(formName) {
    return 'anaden_calc_presets_' + formName;
}

/**
 * プリセット一覧を取得
 * @param {string} formName - フォーム名
 * @return {Object} プリセットオブジェクト
 */
function getPresets(formName) {
    var key = getStorageKey(formName);
    var data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
}

/**
 * プリセット一覧を保存
 * @param {string} formName - フォーム名
 * @param {Object} presets - プリセットオブジェクト
 */
function savePresets(formName, presets) {
    var key = getStorageKey(formName);
    localStorage.setItem(key, JSON.stringify(presets));
}

/**
 * 現在のフォーム状態をプリセットとして保存
 * @param {string} formName - フォーム名
 */
function savePreset(formName) {
    var nameInput = document.getElementById('presetName_' + formName);
    var name = nameInput.value.trim();
    if (!name) {
        alert(t('preset.enterName'));
        return;
    }

    var form = document.forms[formName];
    var data = {};

    // 全入力要素を保存
    var inputs = form.querySelectorAll('input[type="number"], input[type="checkbox"], select');
    inputs.forEach(function(input) {
        if (input.name) {
            if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else {
                data[input.name] = input.value;
            }
        }
    });

    var presets = getPresets(formName);
    presets[name] = data;
    savePresets(formName, presets);

    updatePresetList(formName);
    nameInput.value = '';
    alert(t('preset.saved', {name: name}));
}

/**
 * プリセットを読み込む
 * @param {string} formName - フォーム名
 */
function loadPreset(formName) {
    var select = document.getElementById('presetList_' + formName);
    var name = select.value;
    if (!name) {
        alert(t('preset.loadSelect'));
        return;
    }

    var presets = getPresets(formName);
    var data = presets[name];
    if (!data) {
        alert(t('preset.notFound'));
        return;
    }

    var form = document.forms[formName];

    // 全入力要素に値を復元
    for (var key in data) {
        var input = form.elements[key];
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = data[key];
            } else {
                input.value = data[key];
            }
        }
    }

    // 計算を実行（FORM_CONFIGを使用）
    var config = (formName === FORM_CONFIG.MAGIC.name) ? FORM_CONFIG.MAGIC : FORM_CONFIG.PHYSICAL;
    calculate(formName, config.type, config.base);

    alert(t('preset.loaded', {name: name}));
}

/**
 * プリセットを削除
 * @param {string} formName - フォーム名
 */
function deletePreset(formName) {
    var select = document.getElementById('presetList_' + formName);
    var name = select.value;
    if (!name) {
        alert(t('preset.deleteSelect'));
        return;
    }

    if (!confirm(t('preset.deleteConfirm', {name: name}))) {
        return;
    }

    var presets = getPresets(formName);
    delete presets[name];
    savePresets(formName, presets);

    updatePresetList(formName);
    alert(t('preset.deleted', {name: name}));
}

/**
 * プリセット選択リストを更新
 * @param {string} formName - フォーム名
 */
function updatePresetList(formName) {
    var select = document.getElementById('presetList_' + formName);
    var presets = getPresets(formName);
    var names = Object.keys(presets).sort();

    select.innerHTML = '<option value="">' + t('preset.select') + '</option>';
    names.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

/**
 * 削除ボタンの有効/無効を更新
 * @param {string} formName - フォーム名
 */
function updateDeleteBtn(formName) {
    // 選択状態に応じてボタンの有効/無効を切り替える（オプション）
}
