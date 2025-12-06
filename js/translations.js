// ============================================
// 翻訳辞書 - 日本語・英語・中文
// ============================================

var TRANSLATIONS = {
    ja: {
        // タブ
        tabs: {
            physical: "腕力依存",
            magic: "知性依存"
        },

        // ページタイトル
        title: "アナデン ダメージ計算ツール",
        pageTitle: "アナデン ダメージ計算ツール（完全版）",

        // ボタン
        buttons: {
            reset: "リセット",
            calculate: "計算",
            save: "保存",
            load: "読込",
            delete: "削除",
            shareUrl: "🔗 URL共有",
            shareText: "📋 テキスト共有",
            shareImage: "📷 画像共有"
        },

        // プリセット
        preset: {
            title: "プリセット管理",
            name: "プリセット名",
            select: "-- 選択 --",
            enterName: "プリセット名を入力してください",
            saved: "「{name}」を保存しました",
            loadSelect: "読み込むプリセットを選択してください",
            loaded: "「{name}」を読み込みました",
            notFound: "プリセットが見つかりません",
            deleteSelect: "削除するプリセットを選択してください",
            deleteConfirm: "「{name}」を削除しますか？",
            deleted: "「{name}」を削除しました"
        },

        // セクション
        sections: {
            statusPower: "ステータス・威力",
            equipment: "装備効果",
            damageModifiers: "ダメージ補正",
            specialBuffs: "特殊バフ・コンボなど",
            auraEnvironment: "オーラ/環境効果",
            results: "計算結果"
        },

        // ステータス
        stats: {
            ally: "味方ステータス",
            enemy: "敵ステータス",
            skill: "スキル",
            power: "腕力",
            intelligence: "知性",
            mp: "MP",
            weaponPhyAtk: "武器攻撃",
            weaponMagAtk: "武器魔力",
            attack: "攻撃",
            magic: "魔力",
            defense: "防御",
            magicDefense: "魔防",
            level: "Lv",
            skillPower: "威力"
        },

        // 装備効果
        equipment: {
            elementalBuff: "属性バフ(装備効果)",
            hpCondition: "HP条件強化(装備効果)",
            statusAilment: "状態異常強化(装備効果)",
            weaknessEnhance: "弱点強化",
            mpCostAttack: "MP消費攻撃",
            targetAim: "狙い撃つ",
            enemyCount: "てきのかず",
            enemyCountNum: "敵数",
            lightShadow: "天冥人数補正",
            statusEnhance: "状態異常エンハンス",
            overthrowEquip: "下克上(装備効果)",
            damageGrowth: "与ダメ倍成長",
            damageReductionGrowth: "被ダメ減成長(敵)",
            despairPower: "絶望の力",
            despairCount: "人数"
        },

        // ダメージ補正
        buffs: {
            powerBuff: "腕力バフ",
            intelligenceBuff: "知性バフ",
            physicalResDebuff: "物耐デバフ(敵)",
            magicalResDebuff: "魔耐デバフ(敵)",
            elementalResDebuff: "属耐デバフ(敵)",
            weaponTypeBuff: "武器種バフ",
            elementalBuff: "属性バフ",
            criticalDamageBuff: "クリダメバフ",
            debuff: "デバフ",
            buff: "バフ",
            shingittai: "心技一体",
            mental: "精神統一",
            eagle: "虎視眈眼",
            overthrow: "下克上",
            break: "ブレイク",
            barrier: "バリア(敵)",
            overCritical: "オーバークリティカル",
            freeSlot: "自由枠"
        },

        // 特殊バフ
        special: {
            teishin: "挺身",
            shashin: "捨身",
            shingan: "心眼",
            multiHit: "多段強化",
            multiHitCount: "撃目　威力×",
            weaknessDamageUp: "弱点ダメージアップ",
            weaknessMultiplier: "弱点倍率",
            combo: "コンボ%",
            sing: "歌唱",
            pray: "祈祷",
            zone: "ZONE",
            zoneDamageUp: "ZONE展開時ダメージUP",
            azEnhance: "AZ時強化",
            statFixedIncrease: "能力固定値上昇",
            powerUp: "腕力UP",
            intelligenceUp: "知性UP"
        },

        // オーラ/環境
        aura: {
            auraIncrease: "オーラ増加",
            envIncrease: "環境増加",
            reduction: "軽減"
        },

        // 計算結果
        results: {
            singleTarget: "単体攻撃 (×1.1)",
            shortenDigits: "桁簡略化",
            elementalMultiplier: "属性倍率",
            weaknessMultiplier: "弱点倍率",
            elemental: "属性攻撃",
            nonElemental: "無属性攻撃",
            normal: "通常",
            critical: "クリティカル",
            neutral: "等倍",
            weakness: "弱点",
            resistance: "耐性",
            enemyToAlly: "敵→味方",
            internalDamage: "内部ダメージ",
            reducedDamage: "減衰後ダメージ"
        },

        // フッター
        footer: {
            note1: "※ アナザーエデン ダメージ計算式に基づいて計算",
            note2: "※ オレンジ色の数値はクリティカル時のダメージ"
        },

        // 共有機能
        share: {
            urlCopied: "共有用URLをクリップボードにコピーしました！",
            textCopied: "計算結果をテキストでコピーしました！",
            imageSaved: "画像をダウンロードしました！",
            urlLoaded: "共有された設定を読み込みました！",
            copyFailed: "クリップボードへのコピーに失敗しました。URL: ",
            loadFailed: "URLからの読み込みに失敗しました: ",
            imageFailed: "画像共有でエラーが発生しました: ",
            textFailed: "テキスト共有でエラーが発生しました: ",
            formNotFound: "フォームが見つかりません",
            decompressFailed: "データの解凍に失敗しました",
            resultTitle: "【アナデン ダメージ計算結果】",
            calcType: "計算タイプ",
            damageResults: "■ ダメージ計算結果",
            statusSection: "■ ステータス・威力",
            equipmentSection: "■ 装備効果",
            buffsSection: "■ ダメージ補正",
            specialSection: "■ 特殊バフ・コンボなど",
            auraSection: "■ オーラ/環境効果",
            toolCredit: "このツールで作成:",
            toolUrl: "https://kawaiiwarabou.github.io/AnotherEdenCalc/",
            // 結果ラベル
            eleNormalNormal: "属性攻撃・等倍・通常",
            eleNormalCritical: "属性攻撃・等倍・クリティカル",
            eleWeakNormal: "属性攻撃・弱点・通常",
            eleWeakCritical: "属性攻撃・弱点・クリティカル",
            nonEleNormalNormal: "無属性攻撃・等倍・通常",
            nonEleNormalCritical: "無属性攻撃・等倍・クリティカル",
            nonEleWeakNormal: "無属性攻撃・弱点・通常",
            nonEleWeakCritical: "無属性攻撃・弱点・クリティカル"
        },

        // 浮動ダメージ表示
        floating: {
            title: "クリティカルダメージ"
        },

        // 選択肢
        options: {
            elpis: "エルピス",
            mujima: "ムジマ"
        }
    },

    en: {
        // Tabs
        tabs: {
            physical: "Power-based",
            magic: "Intelligence-based"
        },

        // Page title
        title: "Another Eden Damage Calculator",
        pageTitle: "Another Eden Damage Calculator (Full Version)",

        // Buttons
        buttons: {
            reset: "Reset",
            calculate: "Calculate",
            save: "Save",
            load: "Load",
            delete: "Delete",
            shareUrl: "🔗 Share URL",
            shareText: "📋 Share Text",
            shareImage: "📷 Share Image"
        },

        // Preset
        preset: {
            title: "Preset Management",
            name: "Preset Name",
            select: "-- Select --",
            enterName: "Please enter a preset name",
            saved: '"{name}" has been saved',
            loadSelect: "Please select a preset to load",
            loaded: '"{name}" has been loaded',
            notFound: "Preset not found",
            deleteSelect: "Please select a preset to delete",
            deleteConfirm: 'Delete "{name}"?',
            deleted: '"{name}" has been deleted'
        },

        // Sections
        sections: {
            statusPower: "Stats & Power",
            equipment: "Equipment Effects",
            damageModifiers: "Damage Modifiers",
            specialBuffs: "Special Buffs & Combos",
            auraEnvironment: "Aura/Environment Effects",
            results: "Calculation Results"
        },

        // Stats
        stats: {
            ally: "Ally Stats",
            enemy: "Enemy Stats",
            skill: "Skill",
            power: "Power",
            intelligence: "Intelligence",
            mp: "MP",
            weaponPhyAtk: "Weapon ATK",
            weaponMagAtk: "Weapon MAG",
            attack: "Attack",
            magic: "Magic",
            defense: "Defense",
            magicDefense: "Magic Defense",
            level: "Lv",
            skillPower: "Skill Power"
        },

        // Equipment
        equipment: {
            elementalBuff: "Elemental Buff (Equipment)",
            hpCondition: "HP Condition Boost (Equipment)",
            statusAilment: "Status Ailment Boost (Equipment)",
            weaknessEnhance: "Weakness Enhancement",
            mpCostAttack: "MP Cost Attack",
            targetAim: "Target Aim",
            enemyCount: "Enemy Count",
            enemyCountNum: "# of Enemies",
            lightShadow: "Light/Shadow Bonus",
            statusEnhance: "Status Ailment Enhancement",
            overthrowEquip: "Overthrow (Equipment)",
            damageGrowth: "Damage Dealt Growth",
            damageReductionGrowth: "Damage Taken Reduction (Enemy)",
            despairPower: "Power of Despair",
            despairCount: "Count"
        },

        // Buffs
        buffs: {
            powerBuff: "Power Buff",
            intelligenceBuff: "Intelligence Buff",
            physicalResDebuff: "Physical Resistance Debuff (Enemy)",
            magicalResDebuff: "Magic Resistance Debuff (Enemy)",
            elementalResDebuff: "Elemental Resistance Debuff (Enemy)",
            weaponTypeBuff: "Weapon Type Buff",
            elementalBuff: "Elemental Buff",
            criticalDamageBuff: "Critical Damage Buff",
            debuff: "Debuff",
            buff: "Buff",
            shingittai: "Mind & Body Unity",
            mental: "Mental Focus",
            eagle: "Eagle Eye",
            overthrow: "Overthrow",
            break: "Break",
            barrier: "Barrier (Enemy)",
            overCritical: "Over Critical",
            freeSlot: "Free Slot"
        },

        // Special
        special: {
            teishin: "Teishin",
            shashin: "Shashin",
            shingan: "Mind's Eye",
            multiHit: "Multi-Hit Enhancement",
            multiHitCount: "Hit × Power",
            weaknessDamageUp: "Weakness Damage Up",
            weaknessMultiplier: "Weakness Multiplier",
            combo: "Combo %",
            sing: "Sing",
            pray: "Pray",
            zone: "ZONE",
            zoneDamageUp: "ZONE Active Damage Up",
            azEnhance: "Another Zone Enhancement",
            statFixedIncrease: "Stat Fixed Increase",
            powerUp: "Power UP",
            intelligenceUp: "Intelligence UP"
        },

        // Aura
        aura: {
            auraIncrease: "Aura Increase",
            envIncrease: "Environment Increase",
            reduction: "Reduction"
        },

        // Results
        results: {
            singleTarget: "Single Target (×1.1)",
            shortenDigits: "Shorten Digits",
            elementalMultiplier: "Elemental Multiplier",
            weaknessMultiplier: "Weakness Multiplier",
            elemental: "Elemental Attack",
            nonElemental: "Non-Elemental Attack",
            normal: "Normal",
            critical: "Critical",
            neutral: "Neutral",
            weakness: "Weakness",
            resistance: "Resistance",
            enemyToAlly: "Enemy→Ally",
            internalDamage: "Internal Damage",
            reducedDamage: "Reduced Damage"
        },

        // Footer
        footer: {
            note1: "※ Calculated based on Another Eden damage formula",
            note2: "※ Orange numbers indicate critical hit damage"
        },

        // Share
        share: {
            urlCopied: "Share URL copied to clipboard!",
            textCopied: "Calculation results copied as text!",
            imageSaved: "Image downloaded!",
            urlLoaded: "Shared settings loaded!",
            copyFailed: "Failed to copy to clipboard. URL: ",
            loadFailed: "Failed to load from URL: ",
            imageFailed: "Error occurred during image sharing: ",
            textFailed: "Error occurred during text sharing: ",
            formNotFound: "Form not found",
            decompressFailed: "Failed to decompress data",
            resultTitle: "【Another Eden Damage Calculation Results】",
            calcType: "Calculation Type",
            damageResults: "■ Damage Calculation Results",
            statusSection: "■ Stats & Power",
            equipmentSection: "■ Equipment Effects",
            buffsSection: "■ Damage Modifiers",
            specialSection: "■ Special Buffs & Combos",
            auraSection: "■ Aura/Environment Effects",
            toolCredit: "Created with:",
            toolUrl: "https://kawaiiwarabou.github.io/AnotherEdenCalc/",
            // Result labels
            eleNormalNormal: "Elemental・Neutral・Normal",
            eleNormalCritical: "Elemental・Neutral・Critical",
            eleWeakNormal: "Elemental・Weakness・Normal",
            eleWeakCritical: "Elemental・Weakness・Critical",
            nonEleNormalNormal: "Non-Elemental・Neutral・Normal",
            nonEleNormalCritical: "Non-Elemental・Neutral・Critical",
            nonEleWeakNormal: "Non-Elemental・Weakness・Normal",
            nonEleWeakCritical: "Non-Elemental・Weakness・Critical"
        },

        // Floating
        floating: {
            title: "Critical Damage"
        },

        // Options
        options: {
            elpis: "Elpis",
            mujima: "Mujima"
        }
    },

    zh: {
        // 标签页
        tabs: {
            physical: "腕力依存",
            magic: "智力依存"
        },

        // 页面标题
        title: "另一个伊甸 伤害计算器",
        pageTitle: "另一个伊甸 伤害计算器（完全版）",

        // 按钮
        buttons: {
            reset: "重置",
            calculate: "计算",
            save: "保存",
            load: "读取",
            delete: "删除",
            shareUrl: "🔗 分享URL",
            shareText: "📋 分享文本",
            shareImage: "📷 分享图片"
        },

        // 预设
        preset: {
            title: "预设管理",
            name: "预设名称",
            select: "-- 选择 --",
            enterName: "请输入预设名称",
            saved: '已保存「{name}」',
            loadSelect: "请选择要读取的预设",
            loaded: '已读取「{name}」',
            notFound: "未找到预设",
            deleteSelect: "请选择要删除的预设",
            deleteConfirm: '删除「{name}」？',
            deleted: '已删除「{name}」'
        },

        // 区域
        sections: {
            statusPower: "属性·威力",
            equipment: "装备效果",
            damageModifiers: "伤害修正",
            specialBuffs: "特殊增益·连击等",
            auraEnvironment: "光环/环境效果",
            results: "计算结果"
        },

        // 属性
        stats: {
            ally: "我方属性",
            enemy: "敌方属性",
            skill: "技能",
            power: "腕力",
            intelligence: "智力",
            mp: "MP",
            weaponPhyAtk: "武器攻击",
            weaponMagAtk: "武器魔力",
            attack: "攻击",
            magic: "魔力",
            defense: "防御",
            magicDefense: "魔防",
            level: "等级",
            skillPower: "威力"
        },

        // 装备
        equipment: {
            elementalBuff: "属性增益(装备效果)",
            hpCondition: "HP条件强化(装备效果)",
            statusAilment: "状态异常强化(装备效果)",
            weaknessEnhance: "弱点强化",
            mpCostAttack: "MP消费攻击",
            targetAim: "瞄准射击",
            enemyCount: "敌人数量",
            enemyCountNum: "敌人数",
            lightShadow: "光暗人数补正",
            statusEnhance: "状态异常增强",
            overthrowEquip: "下克上(装备效果)",
            damageGrowth: "造成伤害倍率成长",
            damageReductionGrowth: "受到伤害减少成长(敌)",
            despairPower: "绝望之力",
            despairCount: "人数"
        },

        // 增益
        buffs: {
            powerBuff: "腕力增益",
            intelligenceBuff: "智力增益",
            physicalResDebuff: "物理抗性削弱(敌)",
            magicalResDebuff: "魔法抗性削弱(敌)",
            elementalResDebuff: "属性抗性削弱(敌)",
            weaponTypeBuff: "武器类型增益",
            elementalBuff: "属性增益",
            criticalDamageBuff: "暴击伤害增益",
            debuff: "削弱",
            buff: "增益",
            shingittai: "心技一体",
            mental: "精神统一",
            eagle: "虎视眈眈",
            overthrow: "下克上",
            break: "破防",
            barrier: "护盾(敌)",
            overCritical: "超暴击",
            freeSlot: "自由栏"
        },

        // 特殊
        special: {
            teishin: "挺身",
            shashin: "舍身",
            shingan: "心眼",
            multiHit: "多段强化",
            multiHitCount: "击 威力×",
            weaknessDamageUp: "弱点伤害提升",
            weaknessMultiplier: "弱点倍率",
            combo: "连击%",
            sing: "歌唱",
            pray: "祈祷",
            zone: "领域",
            zoneDamageUp: "领域展开时伤害提升",
            azEnhance: "超领域强化",
            statFixedIncrease: "能力固定值上升",
            powerUp: "腕力UP",
            intelligenceUp: "智力UP"
        },

        // 光环
        aura: {
            auraIncrease: "光环增加",
            envIncrease: "环境增加",
            reduction: "减轻"
        },

        // 结果
        results: {
            singleTarget: "单体攻击 (×1.1)",
            shortenDigits: "数字简化",
            elementalMultiplier: "属性倍率",
            weaknessMultiplier: "弱点倍率",
            elemental: "属性攻击",
            nonElemental: "无属性攻击",
            normal: "通常",
            critical: "暴击",
            neutral: "等倍",
            weakness: "弱点",
            resistance: "抗性",
            enemyToAlly: "敌→我",
            internalDamage: "内部伤害",
            reducedDamage: "衰减后伤害"
        },

        // 页脚
        footer: {
            note1: "※ 基于另一个伊甸伤害计算公式计算",
            note2: "※ 橙色数值表示暴击时的伤害"
        },

        // 分享
        share: {
            urlCopied: "分享URL已复制到剪贴板！",
            textCopied: "计算结果已复制为文本！",
            imageSaved: "图片已下载！",
            urlLoaded: "已读取分享的设置！",
            copyFailed: "复制到剪贴板失败。URL: ",
            loadFailed: "从URL读取失败: ",
            imageFailed: "图片分享时发生错误: ",
            textFailed: "文本分享时发生错误: ",
            formNotFound: "未找到表单",
            decompressFailed: "数据解压失败",
            resultTitle: "【另一个伊甸 伤害计算结果】",
            calcType: "计算类型",
            damageResults: "■ 伤害计算结果",
            statusSection: "■ 属性·威力",
            equipmentSection: "■ 装备效果",
            buffsSection: "■ 伤害修正",
            specialSection: "■ 特殊增益·连击等",
            auraSection: "■ 光环/环境效果",
            toolCredit: "使用工具创建:",
            toolUrl: "https://kawaiiwarabou.github.io/AnotherEdenCalc/",
            // 结果标签
            eleNormalNormal: "属性攻击·等倍·通常",
            eleNormalCritical: "属性攻击·等倍·暴击",
            eleWeakNormal: "属性攻击·弱点·通常",
            eleWeakCritical: "属性攻击·弱点·暴击",
            nonEleNormalNormal: "无属性攻击·等倍·通常",
            nonEleNormalCritical: "无属性攻击·等倍·暴击",
            nonEleWeakNormal: "无属性攻击·弱点·通常",
            nonEleWeakCritical: "无属性攻击·弱点·暴击"
        },

        // 浮动显示
        floating: {
            title: "暴击伤害"
        },

        // 选项
        options: {
            elpis: "艾尔皮斯",
            mujima: "无岛"
        }
    }
};
