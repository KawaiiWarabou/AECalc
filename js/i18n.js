// ============================================
// 国際化(i18n)システム - 言語切り替え
// ============================================

// 現在の言語
var currentLang = 'ja';

// サポートされている言語
var supportedLangs = ['ja', 'en', 'zh'];

/**
 * 翻訳キーから翻訳文字列を取得
 * @param {string} key - 翻訳キー (例: "stats.power")
 * @param {Object} params - 置換パラメータ (例: {name: "test"})
 * @return {string} 翻訳された文字列
 */
function t(key, params) {
    var keys = key.split('.');
    var translation = TRANSLATIONS[currentLang];

    // キーを辿って翻訳を取得
    for (var i = 0; i < keys.length; i++) {
        if (translation && translation[keys[i]] !== undefined) {
            translation = translation[keys[i]];
        } else {
            // 翻訳が見つからない場合は日本語にフォールバック
            translation = TRANSLATIONS.ja;
            for (var j = 0; j < keys.length; j++) {
                if (translation && translation[keys[j]] !== undefined) {
                    translation = translation[keys[j]];
                } else {
                    console.warn('Translation not found for key: ' + key);
                    return key;
                }
            }
            break;
        }
    }

    // パラメータ置換 ({name} など)
    if (params && typeof translation === 'string') {
        for (var param in params) {
            translation = translation.replace('{' + param + '}', params[param]);
        }
    }

    return translation;
}

/**
 * 言語を設定
 * @param {string} lang - 言語コード ('ja', 'en', 'zh')
 */
function setLanguage(lang) {
    console.log('setLanguage called with:', lang);

    if (supportedLangs.indexOf(lang) === -1) {
        console.warn('Unsupported language: ' + lang);
        lang = 'ja';
    }

    currentLang = lang;
    console.log('Current language set to:', currentLang);

    // localStorageに保存
    try {
        localStorage.setItem('anaden_calc_lang', lang);
    } catch (e) {
        console.error('Failed to save language preference:', e);
    }

    // ページ全体を更新
    updatePageLanguage();

    // 言語切り替えボタンの状態を更新
    updateLanguageSwitcherState();
}

/**
 * 現在の言語を取得
 * @return {string} 言語コード
 */
function getCurrentLanguage() {
    return currentLang;
}

/**
 * ページ全体の言語を更新
 */
function updatePageLanguage() {
    console.log('updatePageLanguage called, current language:', currentLang);

    // data-i18n属性を持つ全ての要素を更新
    var elements = document.querySelectorAll('[data-i18n]');
    console.log('Found', elements.length, 'elements with data-i18n attribute');

    elements.forEach(function(element) {
        var key = element.getAttribute('data-i18n');
        var translation = t(key);

        // プレースホルダーの場合
        if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', translation);
        } else {
            element.textContent = translation;
        }
    });

    // タイトルを更新
    document.title = t('pageTitle');

    // select要素の中のoptionを更新
    updateSelectOptions();

    // 計算結果を再計算（フォーム名とタイプを判定）
    recalculateIfNeeded();
}

/**
 * select要素のoptionを更新
 */
function updateSelectOptions() {
    // プリセット選択のデフォルトオプション
    var presetSelects = document.querySelectorAll('select[id^="presetList_"]');
    presetSelects.forEach(function(select) {
        var firstOption = select.querySelector('option[value=""]');
        if (firstOption) {
            firstOption.textContent = t('preset.select');
        }
    });

    // 下克上の選択肢
    var overthrowSelects = document.querySelectorAll('select[name="OverthrowEqType"]');
    overthrowSelects.forEach(function(select) {
        var options = select.querySelectorAll('option');
        options.forEach(function(option) {
            var value = option.value;
            if (value === 'elpis') {
                option.textContent = t('options.elpis');
            } else if (value === 'mujima') {
                option.textContent = t('options.mujima');
            }
        });
    });

    // 多段強化の選択肢（数字なので変更不要）
}

/**
 * 必要に応じて計算結果を再計算
 */
function recalculateIfNeeded() {
    // calculate関数が定義されているかチェック
    if (typeof calculate === 'undefined') {
        return;
    }

    // アクティブなタブを判定
    var physicalTab = document.getElementById('physical');
    var magicTab = document.getElementById('magic');

    if (physicalTab && physicalTab.classList.contains('active')) {
        calculate('PhysicP', 'Phy', 'Pwr');
    } else if (magicTab && magicTab.classList.contains('active')) {
        calculate('MagicI', 'Mag', 'Itg');
    }
}

/**
 * 言語切り替えボタンの状態を更新
 */
function updateLanguageSwitcherState() {
    var buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function(button) {
        var lang = button.getAttribute('data-lang');
        if (lang === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * 初期化：保存された言語設定を読み込む
 */
function initializeLanguage() {
    console.log('initializeLanguage called');

    // URLパラメータから言語を取得
    var urlParams = new URLSearchParams(window.location.search);
    var langFromUrl = urlParams.get('lang');

    if (langFromUrl && supportedLangs.indexOf(langFromUrl) !== -1) {
        currentLang = langFromUrl;
        console.log('Language set from URL:', currentLang);
    } else {
        // localStorageから言語設定を取得
        try {
            var savedLang = localStorage.getItem('anaden_calc_lang');
            if (savedLang && supportedLangs.indexOf(savedLang) !== -1) {
                currentLang = savedLang;
                console.log('Language loaded from localStorage:', currentLang);
            }
        } catch (e) {
            console.error('Failed to load language preference:', e);
        }
    }

    console.log('Initial language:', currentLang);

    // ページの言語を更新
    updatePageLanguage();

    // 言語切り替えボタンの状態を更新
    updateLanguageSwitcherState();
}

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
    initializeLanguage();
}
