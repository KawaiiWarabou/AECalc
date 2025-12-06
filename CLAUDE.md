# CLAUDE.md - AI Assistant Guide for AnotherEdenCalc

## Project Overview

**AnotherEdenCalc** is a web-based damage calculator for the mobile game "Another Eden" (アナザーエデン). This tool helps players optimize character builds and understand complex damage mechanics through detailed calculations.

- **Type**: Single-page web application (SPA)
- **Target Audience**: Japanese-speaking "Another Eden" players
- **Deployment**: GitHub Pages at https://kawaiiwarabou.github.io/AECalc/
- **Size**: ~1,700 lines of code, ~120KB total

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup with form-based UI
- **CSS3**: Custom styling with CSS variables, flexbox, grid
- **Vanilla JavaScript (ES5)**: No frameworks or build tools
- **LocalStorage API**: Client-side persistence for presets

### No Dependencies
- Zero npm packages
- No build tools (webpack, babel, vite)
- No CSS frameworks (Bootstrap, Tailwind)
- No JS frameworks (React, Vue, Angular)
- No testing frameworks

This is intentional: the project is designed to be lightweight, fast-loading, and work offline after initial load.

## Codebase Structure

```
/home/user/AECalc/
├── index.html              # Main application (840 lines)
├── styles.css              # All styling (110 lines)
├── README.md               # Project description (Japanese)
├── .nojekyll               # GitHub Pages config
└── js/                     # Modular JavaScript
    ├── utils.js            # Utility functions (103 lines)
    ├── buffCalculations.js # Buff/debuff system (397 lines)
    ├── damageCalculation.js # Core damage engine (107 lines)
    ├── presets.js          # Preset management (125 lines)
    └── ui.js               # UI controls (26 lines)
```

## Code Organization

### File Responsibilities

#### 1. **index.html** (Main Entry Point)
- Dual calculator forms: Physical (腕力依存) and Magic (知性依存)
- Structured sections: Status, Equipment, Damage Modifiers, Special Buffs
- Collapsible sections for better UX
- Results table with 8 damage scenarios
- Script loading order: utils → buffCalculations → damageCalculation → presets → ui

#### 2. **js/utils.js** (Utility Functions)
Key functions:
- `RoundDown(x, y)`: Precision rounding to `y` decimal places
- `Int(x)`: Integer conversion (rounds down)
- `calcDamageReduction(internalDmg)`: Handles 2.5 billion damage cap with tiered reduction
- `formatNum(num, shorten)`: Number formatting with Japanese 億 (oku) units
- `Diminish(list)`: Buff stacking with diminishing returns algorithm
- `getValue(elem)`: Safe integer extraction from form elements
- `getNumber(elem)`: Safe float extraction from form elements

#### 3. **js/buffCalculations.js** (Buff System - 40+ Functions)
Organized by category:
- **Stat Buffs**: `cPwrBf()`, `cItgBf()`, `cSpdBf()`, `cLckBf()`
- **Resistance Debuffs**: `cPhyRDb()`, `cMagRDb()`, `cEleRDb()`
- **Damage Modifiers**: `cDmgBf()`, `cEleDmgBf()`, `cPhyDmgBf()`
- **Equipment Effects**: `cEleBfEq()`, `cHpBfEq()`, `cPPEq()`
- **Special Mechanics**: `cOverthrow()`, `cShingittai()`, `cMental()`, `cAura()`
- **Environmental**: `cEnv()`, `cZone()`, `cLunaweapon()`

All functions follow the pattern:
```javascript
function cBuffName(x) {
    var f = document.forms[x];
    // Check if buff is enabled (checkbox)
    // Extract values from form
    // Apply calculations and diminishing returns
    // Return multiplier or modifier
}
```

#### 4. **js/damageCalculation.js** (Core Engine)
Main function: `calculate(formName, type, base)`
- Aggregates all buffs and modifiers
- Implements Another Eden's damage formula
- Calculates 8 scenarios:
  1. Normal hit (min/max random)
  2. Resistance hit (min/max random)
  3. Elemental weakness hit (min/max random)
  4. Critical hit (min/max random)
- Updates DOM with results
- Applies damage reduction for values >2.5 billion

**Damage Formula Structure:**
```javascript
Dmg = ((AtkA - Def/modifier) * (AtkB/32 + 1) * multiplier * EleMod + AtkA * random/25.6) * Mod
```

#### 5. **js/presets.js** (Data Persistence)
Functions:
- `savePreset()`: Serializes form state to localStorage
- `loadPreset(presetName)`: Restores form state from localStorage
- `deletePreset(presetName)`: Removes saved preset
- `updatePresetList()`: Refreshes UI dropdown

Storage format: JSON object with all form input values keyed by input name

#### 6. **js/ui.js** (Interface Controls)
Functions:
- `switchTab(tabId)`: Toggle between Physical/Magic calculators
- `toggleSection(element)`: Collapsible section animation
- `resetForm(formName)`: Clear all form inputs
- DOMContentLoaded initialization

## Coding Conventions

### JavaScript Style
- **Language**: ES5 syntax (for maximum compatibility)
- **Function naming**: camelCase (English)
- **Variable naming**: Abbreviated but descriptive (`Pwr`, `Itg`, `PhyAtk`)
- **Comments**: Japanese (target audience language)
- **Form access**: `document.forms[formName].elementName`
- **No semicolons**: Inconsistently used (existing code style)

### Naming Patterns
- **Calculation functions**: Prefix `c` (e.g., `cPwrBf`, `cDmgBf`)
- **Buff functions**: Suffix `Bf` (e.g., `cPwrBf`, `cEleBf`)
- **Debuff functions**: Suffix `Db` (e.g., `cPhyRDb`, `cMagRDb`)
- **Equipment effects**: Suffix `Eq` (e.g., `cEleBfEq`, `cHpBfEq`)

### HTML Conventions
- **Form names**: `PhysicP` (Physical) and `MagicI` (Magic)
- **Input names**: Short, consistent abbreviations
- **Checkboxes**: Prefix `Chk` (e.g., `ChkWeak`, `ChkPPEq`)
- **Output elements**: ID format `{formName}-{statName}` (e.g., `PhysicP-PhyAtk`)

### CSS Conventions
- **BEM-like naming**: `.stat-group`, `.buff-row`, `.input-item`
- **Color coding**:
  - Ally stats: Green/teal background
  - Enemy stats: Red/orange background
  - Skill stats: Blue background
  - Equipment effects: Purple labels
- **CSS Variables**: Defined in `:root` for theming

## Development Workflow

### Local Development

**No build process required** - edit files directly:

```bash
# Open in browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux

# Or use local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Making Changes

1. **Read before modifying**: Always read existing code first
2. **Test manually**: Use browser console for debugging
3. **Check both calculators**: Test changes in both Physical and Magic tabs
4. **Verify localStorage**: Test preset save/load functionality
5. **Test edge cases**: Large numbers, empty inputs, 2.5B+ damage

### Git Workflow

Current branch: `claude/claude-md-mipzl6wzzfzm62bu-01VTdaSVouYQJn3zAJyuHm6q`

```bash
# Commit changes
git add .
git commit -m "Description of changes"

# Push to feature branch
git push -u origin claude/claude-md-mipzl6wzzfzm62bu-01VTdaSVouYQJn3zAJyuHm6q
```

### Deployment

**GitHub Pages** automatically deploys from the main branch:
1. Merge feature branch to main
2. GitHub Pages rebuilds site automatically
3. Changes live at: https://kawaiiwarabou.github.io/AECalc/

The `.nojekyll` file ensures raw HTML is served without Jekyll processing.

## Common Tasks and Patterns

### Adding a New Buff

1. **Add function to buffCalculations.js:**
```javascript
function cNewBuff(x) {
    var f = document.forms[x];
    if (!f.ChkNewBuff.checked) return 1.0;
    var val = getValue(f.NewBuff1);
    return 1 + PerChan(val);
}
```

2. **Add HTML controls to both forms in index.html:**
```html
<div class="buff-row">
    <label class="toggle">
        <input type="checkbox" name="ChkNewBuff" onchange="calculate('PhysicP','Phy','Pwr')">
        <span class="slider"></span>
    </label>
    <span class="buff-label">新バフ名</span>
    <input type="number" name="NewBuff1" value="0" onchange="calculate('PhysicP','Phy','Pwr')">%
</div>
```

3. **Integrate into damage calculation in damageCalculation.js**

### Adding a New Input Field

Pattern used throughout:
```html
<div class="input-item">
    <label>ラベル</label>
    <input type="number" name="FieldName" min="0" value="0" onchange="calculate('PhysicP','Phy','Pwr')">
</div>
```

Key points:
- Always include `onchange` to trigger recalculation
- Use consistent naming between Physical and Magic forms
- Set appropriate `min`, `max`, `step` attributes

### Reading Form Values Safely

Always use utility functions:
```javascript
var value = getValue(f.ElementName);  // For integers
var value = getNumber(f.ElementName); // For floats
```

These handle missing elements, NaN values, and enforce minimums.

### Implementing Diminishing Returns

For stackable buffs:
```javascript
var buff1 = getValue(f.Buff1);
var buff2 = getValue(f.Buff2);
var buff3 = getValue(f.Buff3);
var total = Diminish([buff1, buff2, buff3]);
return 1 + PerChan(total);
```

The `Diminish()` function automatically sorts descending and applies the stacking formula.

## Important Considerations for AI Assistants

### Language and Localization
- **UI Text**: Always use Japanese for user-facing content
- **Code Comments**: Japanese preferred (matches existing style)
- **Variable Names**: English abbreviations are acceptable
- **Documentation**: This file is English for AI readability

### Mathematical Precision
- Always use `RoundDown()` for game-accurate calculations
- Never use `Math.round()` - Another Eden uses floor-based rounding
- Apply rounding at the correct points in the calculation pipeline
- The damage reduction tiers at 2.5B must be precisely implemented

### Performance Considerations
- Calculations trigger on every input change (`onchange` events)
- Keep calculation functions lightweight
- Avoid unnecessary DOM updates
- LocalStorage operations are synchronous but fast

### Browser Compatibility
- ES5 syntax ensures IE11+ compatibility
- No modern JS features (arrow functions, template literals, etc.)
- Test in multiple browsers if adding new features
- Mobile responsiveness is important (many mobile players)

### Data Persistence
- Presets use localStorage (5MB limit)
- No server-side storage
- Handle localStorage quota exceeded errors gracefully
- Test preset save/load after form structure changes

### Code Style Consistency
- Match existing code style even if not optimal
- Don't refactor unnecessarily
- Preserve Japanese comments and UI text
- Keep functions small and focused

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

### Testing Checklist
- [ ] Both Physical and Magic calculators work
- [ ] All checkboxes enable/disable correctly
- [ ] Results update on input change
- [ ] Preset save/load works correctly
- [ ] Tab switching preserves state
- [ ] Reset button clears all inputs
- [ ] Damage >2.5B shows internal and reduced values
- [ ] Mobile layout is functional
- [ ] Console has no errors

### Common Pitfalls to Avoid
1. **Don't break form references**: Form names (`PhysicP`, `MagicI`) are hardcoded everywhere
2. **Don't change rounding behavior**: Use `RoundDown()` consistently
3. **Don't add external dependencies**: Keep it vanilla
4. **Don't remove Japanese text**: It's for the target audience
5. **Don't optimize prematurely**: Simplicity > performance here
6. **Don't add comments to unchanged code**: Only comment new logic
7. **Don't create new files unnecessarily**: Prefer editing existing files

## File Location Reference

When working on specific features, refer to:

- **Stats and base calculations**: `js/damageCalculation.js`
- **Buffs, debuffs, equipment effects**: `js/buffCalculations.js`
- **Rounding, formatting, utilities**: `js/utils.js`
- **Save/load functionality**: `js/presets.js`
- **UI interactions**: `js/ui.js`
- **Layout and styling**: `styles.css`
- **Form structure**: `index.html`

## Additional Resources

- **Repository**: https://github.com/KawaiiWarabou/AECalc
- **Live Site**: https://kawaiiwarabou.github.io/AECalc/

## Version History

- **v3.11.0**: Added 2.5 billion damage cap with tiered reduction
- **Recent**: Modularized JavaScript into 5 files
- **Recent**: GitHub Pages setup and configuration
- **Current**: Ongoing refinements and bug fixes

---

**Last Updated**: 2025-12-06
**Maintained By**: AI assistants following this guide should update this file when making structural changes.
