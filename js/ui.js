// UI制御関数

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    // タブボタンを見つけてactiveクラスを追加
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        var onclick = tab.getAttribute('onclick');
        if (onclick && onclick.includes("'" + tabId + "'")) {
            tab.classList.add('active');
        }
    });
}

function toggleSection(elem) {
    elem.classList.toggle('active');
    elem.nextElementSibling.classList.toggle('show');
}

/**
 * フォームをリセットして再計算
 * @param {string} formName - フォーム名
 */
function resetForm(formName) {
    document.forms[formName].reset();
    // FORM_CONFIGを使用してタイプとベースを取得
    var config = (formName === FORM_CONFIG.MAGIC.name) ? FORM_CONFIG.MAGIC : FORM_CONFIG.PHYSICAL;
    calculate(formName, config.type, config.base);
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // URL共有からの読み込みを試みる
    loadFromURL();

    // 両フォームの初期計算とプリセットリスト更新
    var phy = FORM_CONFIG.PHYSICAL;
    var mag = FORM_CONFIG.MAGIC;
    calculate(phy.name, phy.type, phy.base);
    calculate(mag.name, mag.type, mag.base);
    updatePresetList(phy.name);
    updatePresetList(mag.name);

    // 浮遊ダメージ表示の表示/非表示制御
    setupFloatingDamageVisibility();

    // 折りたたみ状態を復元
    restoreFloatingDamageState();
});

// 浮遊ダメージ表示の表示/非表示を制御
function setupFloatingDamageVisibility() {
    var floatingDamage = document.getElementById('floatingDamage');
    var resultsSections = document.querySelectorAll('.results-section');

    if (!floatingDamage || resultsSections.length === 0) return;

    // Intersection Observerで詳細結果セクションの表示状態を監視
    var observer = new IntersectionObserver(function(entries) {
        var anyVisible = false;

        entries.forEach(function(entry) {
            // いずれかの詳細結果セクションが画面に表示されているか確認
            if (entry.isIntersecting) {
                anyVisible = true;
            }
        });

        // 詳細結果が見えている時は浮遊表示を非表示に
        if (anyVisible) {
            floatingDamage.classList.add('hidden');
        } else {
            floatingDamage.classList.remove('hidden');
        }
    }, {
        // ビューポートの50%以上が見えている時にトリガー
        threshold: 0.5
    });

    // すべての詳細結果セクションを監視
    resultsSections.forEach(function(section) {
        observer.observe(section);
    });
}

// フローティングダメージ表示の折りたたみトグル
function toggleFloatingDamage() {
    var floatingDamage = document.getElementById('floatingDamage');
    if (!floatingDamage) return;

    var isCollapsed = floatingDamage.classList.toggle('collapsed');

    // 状態をlocalStorageに保存
    try {
        localStorage.setItem('floatingDamageCollapsed', isCollapsed ? 'true' : 'false');
    } catch (e) {
        // localStorageが使えない場合は無視
    }
}

// フローティングダメージ表示の折りたたみ状態を復元
function restoreFloatingDamageState() {
    var floatingDamage = document.getElementById('floatingDamage');
    if (!floatingDamage) return;

    // スマホ判定（画面幅768px以下）
    var isMobile = window.innerWidth <= 768;

    try {
        var savedState = localStorage.getItem('floatingDamageCollapsed');
        var isCollapsed = savedState === 'true';

        // 保存された状態がない場合、スマホではデフォルトで折りたたむ
        if (savedState === null && isMobile) {
            isCollapsed = true;
        }

        if (isCollapsed) {
            floatingDamage.classList.add('collapsed');
        }
    } catch (e) {
        // localStorageが使えない場合、スマホではデフォルトで折りたたむ
        if (isMobile) {
            floatingDamage.classList.add('collapsed');
        }
    }
}
