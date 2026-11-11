---
name: lesson-plan
description: Create standard Cambodian MoEYS Mathematics Lesson Plans (កិច្ចតែងការបង្រៀន) in Khmer for Preah Krasang Lower Secondary School (អនុវិទ្យាល័យព្រះក្រសាំង) using the Student-Centered Approach (គោលវិធីសិស្សមជ្ឈមណ្ឌល) and 5E Inquiry Strategy (យុទ្ធវិធីបង្រៀនតាមបែបរិះរក 5E) on discrete, full-capacity paginated A4 Landscape sheets (ក្រដាសផ្ដេកបំបែកសន្លឹកដាច់ៗពីគ្នា និងប្រើប្រាស់ក្រដាសឱ្យអស់លទ្ធភាពដូចពេលព្រីន) styled like Microsoft Word with Khmer OS Muol Light headings, deeply indented vertically aligned ៖ metadata, lunar + solar dates (ចន្ទគតិ និងសុរិយគតិ), publication-grade LaTeX (KaTeX) mathematics, 3 columns, and 5 centered steps. Use whenever the user asks to create, write, edit, or format a mathematics lesson plan or កិច្ចតែងការបង្រៀន.
---

# Cambodian Mathematics Lesson Plan (កិច្ចតែងការបង្រៀន — អនុវិទ្យាល័យព្រះក្រសាំង | ក្រដាសផ្ដេក A4, 5E & LaTeX)

Use this skill whenever the user asks to design, write, customize, or export a **Mathematics Lesson Plan (`កិច្ចតែងការបង្រៀន`)**.

## Bundled Starter Resources

Call `get_skill_resources` with `name: "lesson-plan"` and `filenames`:
- `assets/template.html` — Reusable A4 Landscape Microsoft Word + KaTeX LaTeX HTML boilerplate with the official Preah Krasang Lower Secondary School header (in `Khmer OS Muol Light`), deeply indented aligned `៖` metadata table (`វត្ថុបំណង` & `សម្ភារៈឧបទ្ទេស` in `Muol Light`), lunar + solar dates, secondary-school materials (no `ក្តារឆ្នួន`), and official Principal/Teacher signature block
- `assets/word-print.css` — Print-accurate A4 Landscape multi-sheet stylesheet (`@page { size: A4 landscape; margin: 0; }`, compact `9.3pt–9.4pt` typography, discrete `297mm × 210mm` `.a4-page` sheets with `28px` desk gaps on screen, `24mm`-indented `.meta-table` with aligned `៖`, and 1-to-1 page breaks when printing)
- `assets/app.js` — Automatic 1:1 WYSIWYG full-capacity A4 Landscape sheet paginator (`paginateDocument` + `splitOversizedRow`), mobile auto-fit zoom, inline edit toggle with auto-repagination, KaTeX auto-rendering, PDF print handler, and clean Microsoft Word (`.doc`) exporter

---

## Mandatory Structural & Formatting Standards

Every lesson plan generated with this skill **MUST** follow all 8 rules below without exception:

### 1. Official School Header (`Khmer OS Muol Light`), Main Title & Compact Word Typography
- Write the entire lesson plan **100% in formal Khmer (`ភាសាខ្មែរ`)** aligned with Cambodia's Ministry of Education, Youth and Sport (**MoEYS — ក្រសួងអប់រំ យុវជន និងកីឡា**) textbooks (`សៀវភៅសិក្សាគោលគណិតវិទ្យា`).
- Render on **A4 Landscape (`ក្រដាសផ្ដេក` — `297mm × 210mm`)** white sheets (`padding: 10mm 13mm 11.5mm 15mm`) that look like an authentic **Microsoft Word** Print Layout view and export cleanly to `.doc` (`size: 841.9pt 595.3pt; mso-page-orientation: landscape;`).
- **Compact Typography**: Use `Khmer OS Siemreap` / `Hanuman` at **`9.3pt–9.4pt`** (`line-height: 1.45–1.48`) for clean, high-density page utilization, and **`Khmer OS Muol Light` (`Moul`)** at **`9.2pt–10.6pt`** for headings.
- **Top Administrative Header (`.school-admin-block`)** — **MUST** be rendered in **`Khmer OS Muol Light`** (`font-family: var(--font-muol); font-size: 9.2pt;`). Unless the user explicitly requests a different school, ALWAYS use:
  ```html
  <div class="school-admin-block editable-region">
    <p>មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តកំពង់ធំ</p>
    <p>ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុកកំពង់ស្វាយ</p>
    <p>អនុវិទ្យាល័យព្រះក្រសាំង</p>
  </div>
  ```
- **Main Document Title (`.doc-title-block`)** — Write **ONLY `កិច្ចតែងការបង្រៀន`** centered in `Khmer OS Muol Light`:
  ```html
  <div class="doc-title-block editable-region">
    <h1 class="doc-main-title">កិច្ចតែងការបង្រៀន</h1>
  </div>
  ```
  - **NEVER** append `គណិតវិទ្យា` to the main title, and **NEVER** add a parenthetical subtitle below the title.

### 2. Deeply Indented Metadata Block (`24mm`), `Muol Light` Labels & Vertically Aligned `៖`
- **Deep Left Indentation**: Indent `.meta-section` noticeably inward from the left margin (**`margin: 0 0 2.4mm 24mm;`**; `margin-left: 68pt` in Word export) so the metadata block sits handsomely centered-inward rather than hugging the left edge.
- **`Khmer OS Muol Light` on `វត្ថុបំណង` and `សម្ភារៈឧបទ្ទេស`**: Always wrap **`វត្ថុបំណង`** and **`សម្ភារៈឧបទ្ទេស`** in `<span class="meta-muol">...</span>` (`- <span class="meta-muol">វត្ថុបំណង</span>` and `- <span class="meta-muol">សម្ភារៈឧបទ្ទេស</span>`).
- Always use a borderless 2-column `<table class="meta-table">` (`col.meta-col-label { width: 48mm; }` + `col.meta-col-value { width: auto; }`) where **every** `td.meta-value-cell` begins with `<span class="meta-colon">៖</span>`:
  1. **Razor-Straight Vertical `៖` Alignment**: All `៖` signs (`សញ្ញាភ្នែកមាន់`) from `- មុខវិជ្ជា` down to `+ សម្រាប់សិស្ស` MUST sit in one exact vertical column regardless of label length.
  2. **Wrapped-Line Alignment Rule (`ស្មើនឹងសញ្ញាភ្នែកមាន់`)**: Whenever a multi-line value wraps onto a 2nd or 3rd line, the wrapped lines MUST align vertically **directly underneath `៖`**, NEVER wrapping underneath `+ វិជ្ជាសម្បទា`, `+ បំណិនសម្បទា`, or `+ ចរិយាសម្បទា`.
- **STRICT METADATA ROW ORDER & WORDING** (never use 2 side-by-side metadata columns, never include `ជំពូក`, never include a separate `- ថ្នាក់ទី` row, and never include `ដកស្រង់ចេញពីសៀវភៅ`):
  1. **`- មុខវិជ្ជា`** | **`៖ គណិតវិទ្យា ថ្នាក់ទី៧`** *(state subject and grade together on this single line)*
  2. **`- ខ្លឹមសារមេរៀន`** | **`៖ មេរៀនទី... ...`** *(lesson number + lesson title directly; **do NOT write `ជំពូក`***)
  3. **`- ចំណងជើងរង`** | **`៖ ១.៤. ...`** *(numbered section/sub-point such as `១.១.`, `១.៤.` + sub-heading title)*
  4. **`- រយៈពេល`** | **`៖ ៥០ នាទី`** or **`៖ ១០០ នាទី`**
  5. **`- បង្រៀនដោយ`** | **`៖ ............................................................................`**
  6. **`- កាលបរិច្ឆេទ`** | **`៖ ថ្ងៃ............ ......កើត/រោច ខែ......... ឆ្នាំ......... ......ស័ក ព.ស. ២៥៦... ត្រូវនឹងថ្ងៃទី...... ខែ............ ឆ្នាំ២០២...`** *(clear Lunar `ចន្ទគតិ` + Solar `សុរិយគតិ` date)*
  7. **`- <span class="meta-muol">វត្ថុបំណង</span>`** | **`៖ ក្រោយពីរៀនចប់មេរៀននេះ សិស្សមានសមត្ថភាព ៖`**
     - `<tr class="meta-sub-row">` **`+ វិជ្ជាសម្បទា`** | **`៖ ...`** *(Knowledge)*
     - `<tr class="meta-sub-row">` **`+ បំណិនសម្បទា`** | **`៖ ...`** *(Skills)*
     - `<tr class="meta-sub-row">` **`+ ចរិយាសម្បទា`** | **`៖ ...`** *(Attitude / Values)*
  8. **`- គោលវិធី និងយុទ្ធវិធីបង្រៀន`** | **`៖`**
     - `<tr class="meta-sub-row">` **`- គោលវិធី`** | **`៖ សិស្សមជ្ឈមណ្ឌល`**
     - `<tr class="meta-sub-row">` **`- យុទ្ធវិធីបង្រៀន`** | **`៖ តាមបែបរិះរក (5E)`**
  9. **`- <span class="meta-muol">សម្ភារៈឧបទ្ទេស</span>`** | **`៖`**
     - `<tr class="meta-sub-row">` **`+ សម្រាប់គ្រូ`** | **`៖ ...`**
     - `<tr class="meta-sub-row">` **`+ សម្រាប់សិស្ស`** | **`៖ ...`**

### 3. Grade-Appropriate Student Materials — NO `ក្តារឆ្នួន` for Secondary Grades (`ថ្នាក់ធំ` Grades 7–12)
- Secondary school students (`អនុវិទ្យាល័យ` Grades 7–9 and `វិទ្យាល័យ` Grades 10–12) **DO NOT use slates (`ក្តារឆ្នួន`) or erasable slate markers (`ហ្វឺតលុបបាន`)** (those are used only in Primary School Grades 1–6).
- For any lesson plan in **Grade 7 through Grade 12 (`ថ្នាក់ទី៧ ដល់ ថ្នាក់ទី១២`)**:
  - **NEVER** mention `ក្តារឆ្នួន` anywhere in `+ សម្រាប់សិស្ស`, `ជំហានទី១`, `ជំហានទី២`, `ជំហានទី៣ (E2)`, or `ជំហានទី៤ (E5)`.
  - Instead, use **`សៀវភៅសិក្សាគោល`**, **`សៀវភៅសរសេរ`**, **`សៀវភៅព្រាង`**, **`ក្រដាសផ្ទាំងធំ`** (for group work), **`សន្លឹកកិច្ចការខ្លី`**, **`ក្តារខៀន`**, **`ប៊ិច`**, **`ខ្មៅដៃ`**, **`បន្ទាត់`**, **`ដែកឈាន`**, or **`រ៉ាប់ព័រទ័រ`** as appropriate to the topic.

### 4. Discrete Separated Sheets & Full-Capacity Page Utilization (`ប្រើប្រាស់ក្រដាសឱ្យអស់លទ្ធភាព`)
- **NEVER** display the lesson plan on screen as one continuous endless sheet (`កុំឱ្យក្រដាសជាប់តគ្នា`), AND **NEVER** jump prematurely to a new page leaving large empty gaps at the bottom of a sheet.
- Always use the bundled `assets/word-print.css` and `assets/app.js` (`paginateDocument()` + `splitOversizedRow()`):
  - **Pack Every Sheet to Maximum Capacity**: Start `<table class="lesson-table">` (`ជំហានទី១`) right on **Sheet 1 (`ទំព័រទី ១`)** underneath `.meta-section` whenever space allows (`>= 68px`), and whenever any table row overflows a partially filled sheet (`>= 48px` remaining), split that row across the page boundary (`UL`/`OL` items and multi-`<div>` `.math-box` blocks) so the current sheet is filled right down to its bottom margin before continuing onto the next sheet.
  - **Structure `.math-box` for Smooth Page Splitting**: Inside large `.math-box` containers (such as `E2` group activities or `E3` definitions/theorems), wrap each logical bullet/item in its own child `<div>...</div>` rather than separating everything only with `<br />`, allowing `splitOversizedRow()` to pack pages seamlessly.
  - **100% WYSIWYG Print Parity**: Screen sheet breaks MUST match Print/PDF output 1-to-1, repeat `<thead>` at the top of each continuation table, and never leave an orphan `.step-banner-cell` or trailing sub-heading (`<p><strong>...៖</strong></p>`) alone at the bottom of a sheet.

### 5. 3-Column Table & Strictly Centered 5 Steps (Infused with 5E)
- Use a collapsed `1pt solid #000000` 3-column table:
  1. **`សកម្មភាពគ្រូ`** (`28%`)
  2. **`ខ្លឹមសារមេរៀន`** (`44%` — wider middle column for clear LaTeX equations, derivations, and diagrams)
  3. **`សកម្មភាពសិស្ស`** (`28%`)
- **STRICT ALIGNMENT RULE**: All 5 Step header rows (`<td colspan="3" class="step-banner-cell" align="center">`) **MUST BE CENTER-ALIGNED** (`text-align: center !important;`), **NEVER** left-aligned, with duration placed inline:
  - **`ជំហានទី១ ៖ រដ្ឋបាលថ្នាក់រៀន (… នាទី)`**
  - **`ជំហានទី២ ៖ កិច្ចការផ្ទះ និងរំលឹកមេរៀនចាស់ (… នាទី)`**
  - **`ជំហានទី៣ ៖ មេរៀនថ្មី (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី១ ទី២ និងទី៣) (… នាទី)`** (`E1`, `E2`, `E3`)
  - **`ជំហានទី៤ ៖ ពង្រឹងពុទ្ធិ (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី៤ និងទី៥) (… នាទី)`** (`E4`, `E5`)
  - **`ជំហានទី៥ ៖ កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ (… នាទី)`**

### 6. Official Principal Approval, Lunar + Solar Dates (`ចន្ទគតិ និងសុរិយគតិ`) & Clean Teacher Signature
- End the document with `.reflection-box` (`- ការឆ្លុះបញ្ចាំងក្រោយពេលបង្រៀន`) followed by the official 2-column `.signature-table`:
  ```html
  <table class="signature-table editable-region">
    <tbody>
      <tr>
        <td>
          <div class="sig-approval-muol">បានឃើញ និងឯកភាព</div>
          <div>ថ្ងៃ............ ......កើត/រោច ខែ......... ឆ្នាំ......... ......ស័ក ព.ស. ២៥៦...</div>
          <div>ព្រះក្រសាំង, ថ្ងៃទី...... ខែ............ ឆ្នាំ២០២...</div>
          <div class="sig-role-muol">នាយកសាលា</div>
          <div class="sig-space"></div>
        </td>
        <td>
          <div>ថ្ងៃ............ ......កើត/រោច ខែ......... ឆ្នាំ......... ......ស័ក ព.ស. ២៥៦...</div>
          <div>ព្រះក្រសាំង, ថ្ងៃទី...... ខែ............ ឆ្នាំ២០២...</div>
          <div class="sig-role-muol">គ្រូបង្រៀន</div>
          <div class="sig-space"></div>
        </td>
      </tr>
    </tbody>
  </table>
  ```
  - **Left Column (Principal)**: Always use **`បានឃើញ និងឯកភាព`** (in `Khmer OS Muol Light`, `.sig-approval-muol`) and **`នាយកសាលា`** (`.sig-role-muol`), with both Lunar (`ចន្ទគតិ`) and Solar (`សុរិយគតិ`) dates.
  - **Right Column (Teacher)**: Always include both Lunar (`ចន្ទគតិ`) and Solar (`សុរិយគតិ`) dates and **`គ្រូបង្រៀន`** (`.sig-role-muol`), followed by blank signature space (`.sig-space`). **NEVER** write `ឈ្មោះ ៖ ..........................................` at the bottom—leave blank space so the teacher signs and writes their name freely by hand.

### 7. Recommended Step Timings & Publication-Grade LaTeX Mathematics (KaTeX)
- Ensure the 5 step durations sum **exactly** to the total duration:
  - **១ ម៉ោងសិក្សា (`៥០ នាទី`)**: Step 1 (`៤`) + Step 2 (`៦`) + Step 3 (`២៦`: E1 `៤`, E2 `១០`, E3 `១២`) + Step 4 (`១០`: E4 `៦`, E5 `៤`) + Step 5 (`៤`) = `៥០ នាទី`.
  - **២ ម៉ោងសិក្សា (`១០០ នាទី`)**: Step 1 (`៥`) + Step 2 (`១០`) + Step 3 (`៥៥`: E1 `៨`, E2 `២២`, E3 `២៥`) + Step 4 (`២២`: E4 `១២`, E5 `១០`) + Step 5 (`៨`) = `១០០ នាទី`.
- **ALL mathematical expressions MUST use KaTeX v0.16.11** (`$...$` inline and `$$...$$` display; prefer `\dfrac{a}{b}`; use `.potence-table` for Cambodian vertical Euclidean division). Never write plain ASCII math. Always verify balanced `$` and `$$` delimiters before finalizing.

### 8. Mobile-Friendly Deployment & Delivery
- The user frequently accesses lesson plans from a **mobile phone** and cannot open `localhost`:
  - Keep `scripts/app.js` active so `.pages-stack` scales smoothly to fit mobile screens while preserving discrete sheets, printing 1-to-1 onto A4 Landscape pages, and exporting cleanly to `.doc`.
  - When working in a connected GitHub Pages repository (such as `davann2806-cmd/lesson-plan`), commit and push changes, trigger/verify the GitHub Pages build (`gh api -X POST repos/<owner>/<repo>/pages/builds`), and provide an actionable `.url.json` bookmark (`UserFacing: true`).
