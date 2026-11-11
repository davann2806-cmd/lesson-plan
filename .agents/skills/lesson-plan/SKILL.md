---
name: lesson-plan
description: Create standard Cambodian MoEYS Mathematics Lesson Plans (កិច្ចតែងការបង្រៀន) in Khmer for Preah Krasang Lower Secondary School (អនុវិទ្យាល័យព្រះក្រសាំង) using the Student-Centered Approach (គោលវិធីសិស្សមជ្ឈមណ្ឌល) and 5E Inquiry Strategy (យុទ្ធវិធីបង្រៀនតាមបែបរិះរក 5E) on discrete paginated A4 Landscape sheets (ក្រដាសផ្ដេកបំបែកសន្លឹកដាច់ៗពីគ្នាដូចពេលព្រីន) styled like Microsoft Word with vertically aligned ៖ metadata, publication-grade LaTeX (KaTeX) mathematics, 3 columns, and 5 centered steps. Use whenever the user asks to create, write, edit, or format a mathematics lesson plan or កិច្ចតែងការបង្រៀន.
---

# Cambodian Mathematics Lesson Plan (កិច្ចតែងការបង្រៀន — អនុវិទ្យាល័យព្រះក្រសាំង | ក្រដាសផ្ដេក A4, 5E & LaTeX)

Use this skill whenever the user asks to design, write, customize, or export a **Mathematics Lesson Plan (`កិច្ចតែងការបង្រៀន`)**.

## Bundled Starter Resources

Call `get_skill_resources` with `name: "lesson-plan"` and `filenames`:
- `assets/template.html` — Reusable A4 Landscape Microsoft Word + KaTeX LaTeX HTML boilerplate with the official Preah Krasang Lower Secondary School Page 1 header and aligned `៖` metadata table
- `assets/word-print.css` — Print-accurate A4 Landscape multi-sheet stylesheet (`@page { size: A4 landscape; margin: 0; }`, discrete `297mm × 210mm` `.a4-page` sheets with `28px` desk gaps on screen, indented `.meta-table` with aligned `៖`, and 1-to-1 page breaks when printing)
- `assets/app.js` — Automatic 1:1 WYSIWYG A4 Landscape sheet paginator (`paginateDocument`), mobile auto-fit zoom, inline edit toggle with auto-repagination, KaTeX auto-rendering, PDF print handler, and clean Microsoft Word (`.doc`) exporter

---

## Mandatory Structural & Formatting Standards

Every lesson plan generated with this skill **MUST** follow all 7 rules below without exception:

### 1. Official School Header, Main Title & Cambodian Word Appearance
- Write the entire lesson plan **100% in formal Khmer (`ភាសាខ្មែរ`)** aligned with Cambodia's Ministry of Education, Youth and Sport (**MoEYS — ក្រសួងអប់រំ យុវជន និងកីឡា**) textbooks (`សៀវភៅសិក្សាគោលគណិតវិទ្យា`).
- Render on **A4 Landscape (`ក្រដាសផ្ដេក` — `297mm × 210mm`)** white sheets that look like an authentic **Microsoft Word** Print Layout view and export cleanly to `.doc` (`size: 841.9pt 595.3pt; mso-page-orientation: landscape;`).
- **Top Administrative Header (`.school-admin-block`)** — Unless the user explicitly requests a different school, ALWAYS use:
  ```html
  <div class="school-admin-block editable-region">
    <p>មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តកំពង់ធំ</p>
    <p>ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុកកំពង់ស្វាយ</p>
    <p>អនុវិទ្យាល័យព្រះក្រសាំង</p>
  </div>
  ```
- **Main Document Title (`.doc-title-block`)** — Write **ONLY `កិច្ចតែងការបង្រៀន`** centered in `Khmer OS Muol Light` / `Moul`:
  ```html
  <div class="doc-title-block editable-region">
    <h1 class="doc-main-title">កិច្ចតែងការបង្រៀន</h1>
  </div>
  ```
  - **NEVER** append `គណិតវិទ្យា` to the main title, and **NEVER** add a parenthetical subtitle such as `(តាមគោលវិធីសិស្សមជ្ឈមណ្ឌល និងវិធីបង្រៀនបែបរិះរក 5E)` below the title (methodology belongs in `- គោលវិធី និងយុទ្ធវិធីបង្រៀន` inside `.meta-table`).
- Use `Khmer OS Muol Light` / `Moul` (`10.2pt–12pt`) for the Kingdom motto (`ព្រះរាជាណាចក្រកម្ពុជា / ជាតិ សាសនា ព្រះមហាក្សត្រ` + Tacteing ornament SVG), main title, 3 table column headers, 5 centered step banners, and signature titles. Use `Khmer OS Siemreap` / `Hanuman` (`10.2pt–10.5pt`) for body text.

### 2. Indented Page 1 Metadata Block & Vertically Aligned `៖` (`សញ្ញាភ្នែកមាន់`)
- Indent `.meta-section` slightly inward from the left margin (`margin: 0 0 3.5mm 8mm;`).
- Always use a borderless 2-column `<table class="meta-table">` (`col.meta-col-label { width: 52mm; }` + `col.meta-col-value { width: auto; }`) where **every** `td.meta-value-cell` begins with `<span class="meta-colon">៖</span>`:
  1. **Razor-Straight Vertical `៖` Alignment**: All `៖` signs (`សញ្ញាភ្នែកមាន់`) from the very first row down to the very last row MUST sit in one exact vertical column regardless of label length (matching Microsoft Word tab stops).
  2. **Wrapped-Line Alignment Rule (`ស្មើនឹងសញ្ញាភ្នែកមាន់`)**: Whenever a multi-line value wraps onto a 2nd or 3rd line (especially in `- វត្ថុបំណង`), the wrapped lines MUST align vertically **directly underneath `៖`** (`td.meta-value-cell` left edge), NEVER wrapping back underneath `+ វិជ្ជាសម្បទា`, `+ បំណិនសម្បទា`, or `+ ចរិយាសម្បទា`.
- **STRICT PAGE 1 METADATA ROW ORDER & WORDING** (never use 2 side-by-side metadata columns, never include `ជំពូក`, never include a separate `- ថ្នាក់ទី` row, and never include `ដកស្រង់ចេញពីសៀវភៅ`):
  1. **`- មុខវិជ្ជា`** | **`៖ គណិតវិទ្យា ថ្នាក់ទី៧`** *(state subject and grade together on this single line, e.g., `គណិតវិទ្យា ថ្នាក់ទី៧` or `គណិតវិទ្យា ថ្នាក់ទី៨`)*
  2. **`- ខ្លឹមសារមេរៀន`** | **`៖ មេរៀនទី... ...`** *(write lesson number + lesson title directly, e.g., `មេរៀនទី១ ចំនួនគត់`; **do NOT write `ជំពូក`***)
  3. **`- ចំណងជើងរង`** | **`៖ ១.៤. ...`** *(write numbered section/sub-point such as `១.១.`, `១.៣.`, `១.៤.` followed by the sub-heading title, e.g., `១.៤. វិធីចែកចំនួនគត់`)*
  4. **`- រយៈពេល`** | **`៖ ៥០ នាទី`** or **`៖ ១០០ នាទី`** *(e.g., `៥០ នាទី` for 1 study hour, `១០០ នាទី` for 2 study hours)*
  5. **`- បង្រៀនដោយ`** | **`៖ ............................................................................`**
  6. **`- កាលបរិច្ឆេទ`** | **`៖ ថ្ងៃ.................. ទី...... ខែ.................. ឆ្នាំ២០២......`** *(placed below `- បង្រៀនដោយ`)*
  7. **`- វត្ថុបំណង`** | **`៖ ក្រោយពីរៀនចប់មេរៀននេះ សិស្សមានសមត្ថភាព ៖`**
     - `<tr class="meta-sub-row">` **`+ វិជ្ជាសម្បទា`** | **`៖ ...`** *(Knowledge)*
     - `<tr class="meta-sub-row">` **`+ បំណិនសម្បទា`** | **`៖ ...`** *(Skills)*
     - `<tr class="meta-sub-row">` **`+ ចរិយាសម្បទា`** | **`៖ ...`** *(Attitude / Values)*
  8. **`- គោលវិធី និងយុទ្ធវិធីបង្រៀន`** | **`៖`**
     - `<tr class="meta-sub-row">` **`- គោលវិធី`** | **`៖ សិស្សមជ្ឈមណ្ឌល`**
     - `<tr class="meta-sub-row">` **`- យុទ្ធវិធីបង្រៀន`** | **`៖ តាមបែបរិះរក (5E)`**
  9. **`- សម្ភារៈឧបទ្ទេស`** | **`៖`** *(kept at the bottom of Page 1)*
     - `<tr class="meta-sub-row">` **`+ សម្រាប់គ្រូ`** | **`៖ ...`**
     - `<tr class="meta-sub-row">` **`+ សម្រាប់សិស្ស`** | **`៖ ...`**

### 3. Discrete Separated Paper Sheets Matching Print Output 1-to-1 (Strictly Required)
- **NEVER** display the lesson plan on screen as one continuous endless sheet (`កុំឱ្យក្រដាសជាប់តគ្នា`).
- Always use the bundled `assets/word-print.css` and `assets/app.js` (`paginateDocument()`) so the document is dynamically split on screen into **separate, individual `297mm × 210mm` `.a4-page` sheets** inside `.pages-stack` (`gap: 28px` desk gap + paper drop shadow + bottom footer `កិច្ចតែងការបង្រៀន — អនុវិទ្យាល័យព្រះក្រសាំង | ទំព័រទី ១ / ...`).
- **100% WYSIWYG Print Parity**:
  - Keep all of Page 1's header + `table.meta-table` cleanly on **Sheet 1 (`ទំព័រទី ១`)**, with `<table class="lesson-table">` starting cleanly on Sheet 2 (or fitting without splitting `table.meta-table`).
  - Wherever a sheet breaks on screen MUST be **100% identical** to where the printed/PDF page breaks (`@page { size: A4 landscape; margin: 0; }` + `.a4-page { width: 297mm; height: 209.6mm; break-after: page; }`).
  - Repeat `<thead>` (`សកម្មភាពគ្រូ | ខ្លឹមសារមេរៀន | សកម្មភាពសិស្ស`) automatically at the top of every continuation sheet's `<table class="lesson-table">`.
  - Never leave an orphan `.step-banner-cell` (`ជំហានទី១`..`ជំហានទី៥`) alone at the bottom of a sheet without its first content row.
  - Re-run `paginateDocument()` on `DOMContentLoaded`, `window.load`, and `document.fonts.ready` (and after exiting Edit Mode).

### 4. 3-Column Table & Strictly Centered 5 Steps (Infused with 5E)
- Use a collapsed `1pt solid #000000` 3-column table with Landscape column proportions:
  1. **`សកម្មភាពគ្រូ`** (`28%`)
  2. **`ខ្លឹមសារមេរៀន`** (`44%` — wider middle column for clear LaTeX equations, derivations, and diagrams)
  3. **`សកម្មភាពសិស្ស`** (`28%`)
- **STRICT ALIGNMENT RULE**: All 5 Step header rows (`<td colspan="3" class="step-banner-cell" align="center">`) **MUST BE CENTER-ALIGNED** (`text-align: center !important;`), **NEVER** left-aligned, with duration placed inline right after the title:
  - **`ជំហានទី១ ៖ រដ្ឋបាលថ្នាក់រៀន (… នាទី)`** — Greeting, hygiene/order check, attendance report.
  - **`ជំហានទី២ ៖ កិច្ចការផ្ទះ និងរំលឹកមេរៀនចាស់ (… នាទី)`** — `២.១. កែសម្រួលកិច្ចការផ្ទះ` + `២.២. រំលឹកមេរៀនចាស់ភ្ជាប់មេរៀនថ្មី` (with concrete questions & answers).
  - **`ជំហានទី៣ ៖ មេរៀនថ្មី (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី១ ទី២ និងទី៣) (… នាទី)`**:
    - **`១. ដំណាក់កាលបំផុសចំណាប់អារម្មណ៍ (E1)`** — Real-world hook / motivating problem leading to the lesson title (`មេរៀនទី...` and numbered sub-heading `១.៤. ...`).
    - **`២. ដំណាក់កាលរុករក និងស្រាវជ្រាវ (E2)`** — Student-centered small-group inquiry worksheet (`សន្លឹកកិច្ចការក្រុម`) where teacher facilitates with guiding questions without giving away answers.
    - **`៣. ដំណាក់កាលបកស្រាយ និងសំយោគ (E3)`** — Group presentations, peer discussion, formal synthesis of **definitions, theorems/formulas, special cases**, and **worked examples** (`ឧទាហរណ៍គំរូ`).
  - **`ជំហានទី៤ ៖ ពង្រឹងពុទ្ធិ (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី៤ និងទី៥) (… នាទី)`**:
    - **`៤. ដំណាក់កាលពង្រីកចំណេះដឹង (E4)`** — Deeper exercises and real-world word problem (`ចំណោទ`) in a new context, including full expected solutions (`ចម្លើយរំពឹងទុក`).
    - **`៥. ដំណាក់កាលវាយតម្លៃលទ្ធផលសិក្សា (E5)`** — Quick individual assessment (`លើក្តារឆ្នួន` / short quiz) testing all 3 learning objectives, with answers/criteria (`ចម្លើយ និងលក្ខណៈវិនិច្ឆ័យ`).
  - **`ជំហានទី៥ ៖ កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ (… នាទី)`** — Concrete homework exercises (with teacher answer key noted) + preview of next lesson topic + study/safety advice.
- End the document with `- ការឆ្លុះបញ្ចាំងក្រោយពេលបង្រៀន` (`ចំណុចជោគជ័យ` & `បញ្ហាប្រឈម និងដំណោះស្រាយកែលម្អ`) and the formal 2-column MoEYS signature table (`ធ្វើនៅព្រះក្រសាំង ថ្ងៃទី...... ខែ............ ឆ្នាំ២០២...`, `ប្រធានក្រុមបច្ចេកទេស / នាយកសាលា` on the left, `ហត្ថលេខាគ្រូបង្រៀន` on the right).

### 5. Recommended Step Timings
Ensure the 5 step durations sum **exactly** to the total duration:
- **១ ម៉ោងសិក្សា (`៥០ នាទី`)**: Step 1 (`៤ នាទី`) + Step 2 (`៦ នាទី`) + Step 3 (`២៦ នាទី`: E1 `៤`, E2 `១០`, E3 `១២`) + Step 4 (`១០ នាទី`: E4 `៦`, E5 `៤`) + Step 5 (`៤ នាទី`) = `៥០ នាទី`.
- **២ ម៉ោងសិក្សា (`១០០ នាទី`)**: Step 1 (`៥ នាទី`) + Step 2 (`១០ នាទី`) + Step 3 (`៥៥ នាទី`: E1 `៨`, E2 `២២`, E3 `២៥`) + Step 4 (`២២ នាទី`: E4 `១២`, E5 `១០`) + Step 5 (`៨ នាទី`) = `១០០ នាទី`.

### 6. Publication-Grade LaTeX Mathematics (KaTeX) — Mandatory
- **ALL mathematical expressions MUST look like genuine compiled LaTeX** using **KaTeX v0.16.11** (`katex.min.css`, `katex.min.js`, `auto-render.min.js`).
- **NEVER** write plain ASCII or unformatted HTML math (`a = b * q + r`, `x^2`, `3/4`, `<=`, `!=`, or `<i>a = b × q</i>`).
- Write every inline expression inside `$...$` and key definitions/theorems/formulas as centered display equations inside `$$...$$`:
  - Arithmetic & Number Theory: `$a = b \times q + r$`, `$0 \le r < b$`, `$2\,508 \div 12 = 209$`, `$b \neq 0$`
  - Fractions & Roots: `$\dfrac{a}{b}$` (prefer `\dfrac` for clear legibility), `$\sqrt{x^2 + y^2}$`, `$\sqrt[3]{27} = 3$`
  - Algebra & Systems: `$$\begin{cases} 2x + y = 7 \\ x - y = 2 \end{cases}$$`
  - Geometry & Vectors: `$\triangle ABC$`, `$\widehat{ABC} = 90^\circ$`, `$\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$`, `$AB \parallel CD$`, `$AB \perp BC$`
  - Calculus & Functions: `$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$`, `$f'(x)$`, `$\displaystyle\int_a^b f(x)\,dx$`
- For Cambodian vertical Euclidean division (`ប្រមាណវិធីចែកបញ្ឈរ`), use `.potence-table` (inside `.layout-pair-table` when side-by-side) with `$...$` KaTeX math in every cell.
- Always run a quick delimiter check (`node` script checking balanced `$` and `$$`) and verify every calculation mathematically before finalizing.

### 7. Mobile-Friendly Deployment & Delivery
- The user frequently accesses lesson plans from a **mobile phone** and cannot open `localhost`:
  - Keep `scripts/app.js` active so the entire `.pages-stack` of `297mm × 210mm` A4 Landscape sheets scales smoothly to fit mobile screens while preserving clear desk gaps between every sheet, printing 1-to-1 onto A4 Landscape pages, and converting `.katex` annotations cleanly when exporting `.doc` files.
  - When working in a connected GitHub Pages repository (such as `davann2806-cmd/lesson-plan`), commit and push changes, trigger/verify the GitHub Pages build (`gh api -X POST repos/<owner>/<repo>/pages/builds`), and provide an actionable `.url.json` bookmark (`UserFacing: true`) to the public `github.io` page.
  - If no GitHub Pages repo is desired, create a self-contained `.html` artifact in the artifact directory with `UserFacing: true`.
