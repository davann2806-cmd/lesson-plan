---
name: lesson-plan
description: Create standard Cambodian MoEYS Mathematics Lesson Plans (កិច្ចតែងការបង្រៀនគណិតវិទ្យា) in Khmer using the Student-Centered Approach (គោលវិធីសិស្សមជ្ឈមណ្ឌល) and 5E Instructional Model (វិធីបង្រៀន 5E) on A4 Landscape paper (ក្រដាសផ្ដេក) styled like Microsoft Word with publication-grade LaTeX (KaTeX) mathematics, 3 columns, and 5 centered steps. Use whenever the user asks to create, write, edit, or format a mathematics lesson plan or កិច្ចតែងការបង្រៀន.
---

# Cambodian Mathematics Lesson Plan (កិច្ចតែងការបង្រៀនគណិតវិទ្យា — សិស្សមជ្ឈមណ្ឌល, 5E, Word A4 Landscape & LaTeX)

Use this skill whenever the user asks to design, write, customize, or export a **Mathematics Lesson Plan (`កិច្ចតែងការបង្រៀនគណិតវិទ្យា`)**.

## Bundled Starter Resources

Call `get_skill_resources` with `name: "lesson-plan"` and `filenames`:
- `assets/template.html` — Reusable A4 Landscape Microsoft Word + KaTeX LaTeX HTML boilerplate
- `assets/word-print.css` — Print-accurate A4 Landscape stylesheet (`@page { size: A4 landscape; }`, Khmer typography, centered step banners, KaTeX styling, vertical division potence tables)
- `assets/app.js` — Mobile auto-fit zoom, inline edit toggle, KaTeX auto-rendering, PDF print handler, and clean Microsoft Word (`.doc`) exporter

---

## Mandatory Structural & Formatting Standards

Every lesson plan generated with this skill **MUST** follow all 6 rules below without exception:

### 1. Language & Official Cambodian Word Appearance
- Write the entire lesson plan **100% in formal Khmer (`ភាសាខ្មែរ`)** aligned with Cambodia's Ministry of Education, Youth and Sport (**MoEYS — ក្រសួងអប់រំ យុវជន និងកីឡា**) textbooks (`សៀវភៅសិក្សាគោលគណិតវិទ្យា`).
- Render on an **A4 Landscape (`ក្រដាសផ្ដេក` — `297mm × 210mm`)** white sheet that looks like an authentic **Microsoft Word** document when printed/saved as PDF (`@page { size: A4 landscape; margin: 14mm 14mm 14mm 18mm; }`) and when exported to `.doc` (`size: 841.9pt 595.3pt; mso-page-orientation: landscape;`).
- Use `Khmer OS Muol Light` / `Moul` (`10.5pt–12.5pt`) for the Kingdom motto (`ព្រះរាជាណាចក្រកម្ពុជា / ជាតិ សាសនា ព្រះមហាក្សត្រ` + Tacteing ornament SVG), main title, 3 table column headers, 5 centered step banners, and signature titles. Use `Khmer OS Siemreap` / `Hanuman` (`10.5pt–11pt`) for body text.

### 2. Single-Column Vertical Dash (`-`) Header & Materials Below Objectives
- **NEVER** format the lesson metadata header in 2 columns. Always use a **single vertical list** (`ul.dash-list`) where every top-level line begins with a dash (`- `).
- **STRICT ORDERING RULE**: **`- សម្ភារៈឧបទ្ទេស ៖`** MUST ALWAYS be placed **BELOW `- វត្ថុបំណង ៖`**:
  1. `- កាលបរិច្ឆេទ ៖`
  2. `- មុខវិជ្ជា ៖ គណិតវិទ្យា`
  3. `- ថ្នាក់ទី ៖`
  4. `- ជំពូកទី... ៖`
  5. `- មេរៀនទី... ៖`
  6. `- ខ្លឹមសារមេរៀន ៖`
  7. `- រយៈពេល ៖ ... នាទី (... ម៉ោងសិក្សា)` *(1 Cambodian study hour = `៥០ នាទី`; 2 study hours = `១០០ នាទី`; 3 study hours = `១៥០ នាទី`)*
  8. `- បង្រៀនដោយគ្រូ ៖`
  9. `- ដកស្រង់ចេញពី ៖ សៀវភៅសិក្សាគោលគណិតវិទ្យាថ្នាក់ទី... ទំព័រទី... និងសៀវភៅគ្រូ`
  10. `- វត្ថុបំណង ៖ ក្រោយពីរៀនចប់មេរៀននេះ សិស្សមានសមត្ថភាព ៖`
      - `+ វិជ្ជាសម្បទា ៖` (Knowledge)
      - `+ បំណិនសម្បទា ៖` (Skills)
      - `+ ចរិយាសម្បទា ៖` (Attitude / Values)
  11. `- សម្ភារៈឧបទ្ទេស ៖` *(ALWAYS placed underneath `- វត្ថុបំណង ៖`)*
      - `+ សម្រាប់គ្រូ ៖`
      - `+ សម្រាប់សិស្ស ៖`

### 3. 3-Column Table & Strictly Centered 5 Steps (Infused with 5E)
- Use a collapsed `1pt solid #000000` 3-column table (`thead { display: table-header-group; }`) with Landscape column proportions:
  1. **`សកម្មភាពគ្រូ`** (`28%`)
  2. **`ខ្លឹមសារមេរៀន`** (`44%` — wider middle column for clear LaTeX equations, derivations, and diagrams)
  3. **`សកម្មភាពសិស្ស`** (`28%`)
- **STRICT ALIGNMENT RULE**: All 5 Step header rows (`<td colspan="3" class="step-banner-cell" align="center">`) **MUST BE CENTER-ALIGNED** (`text-align: center !important;`), **NEVER** left-aligned, with duration placed inline right after the title:
  - **`ជំហានទី១ ៖ រដ្ឋបាលថ្នាក់រៀន (… នាទី)`** — Greeting, hygiene/order check, attendance report.
  - **`ជំហានទី២ ៖ កិច្ចការផ្ទះ និងរំលឹកមេរៀនចាស់ (… នាទី)`** — `២.១. កែសម្រួលកិច្ចការផ្ទះ` + `២.២. រំលឹកមេរៀនចាស់ភ្ជាប់មេរៀនថ្មី` (with concrete questions & answers).
  - **`ជំហានទី៣ ៖ មេរៀនថ្មី (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី១ ទី២ និងទី៣) (… នាទី)`**:
    - **`១. ដំណាក់កាលបំផុសចំណាប់អារម្មណ៍ (E1)`** — Real-world hook / motivating problem leading to the lesson title.
    - **`២. ដំណាក់កាលរុករក និងស្រាវជ្រាវ (E2)`** — Student-centered small-group inquiry worksheet (`សន្លឹកកិច្ចការក្រុម`) where teacher facilitates with guiding questions without giving away answers.
    - **`៣. ដំណាក់កាលបកស្រាយ និងសំយោគ (E3)`** — Group presentations, peer discussion, formal synthesis of **definitions, theorems/formulas, special cases**, and **worked examples** (`ឧទាហរណ៍គំរូ`).
  - **`ជំហានទី៤ ៖ ពង្រឹងពុទ្ធិ (បញ្ជ្រាបវិធីបង្រៀន 5E ៖ ដំណាក់កាលទី៤ និងទី៥) (… នាទី)`**:
    - **`៤. ដំណាក់កាលពង្រីកចំណេះដឹង (E4)`** — Deeper exercises and real-world word problem (`ចំណោទ`) in a new context, including full expected solutions (`ចម្លើយរំពឹងទុក`).
    - **`៥. ដំណាក់កាលវាយតម្លៃលទ្ធផលសិក្សា (E5)`** — Quick individual assessment (`លើក្តារឆ្នួន` / short quiz) testing all 3 learning objectives, with answers/criteria (`ចម្លើយ និងលក្ខណៈវិនិច្ឆ័យ`).
  - **`ជំហានទី៥ ៖ កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ (… នាទី)`** — Concrete homework exercises (with teacher answer key noted) + preview of next lesson topic + study/safety advice.
- End the document with `- ការឆ្លុះបញ្ចាំងក្រោយពេលបង្រៀន` (`ចំណុចជោគជ័យ` & `បញ្ហាប្រឈម និងដំណោះស្រាយកែលម្អ`) and the formal 2-column MoEYS signature table (`ប្រធានក្រុមបច្ចេកទេស / នាយកសាលា` on the left, `ហត្ថលេខាគ្រូបង្រៀន` on the right).

### 4. Recommended Step Timings
Ensure the 5 step durations sum **exactly** to the total duration:
- **១ ម៉ោងសិក្សា (`៥០ នាទី`)**: Step 1 (`៤ នាទី`) + Step 2 (`៦ នាទី`) + Step 3 (`២៦ នាទី`: E1 `៤`, E2 `១០`, E3 `១២`) + Step 4 (`១០ នាទី`: E4 `៦`, E5 `៤`) + Step 5 (`៤ នាទី`) = `៥០ នាទី`.
- **២ ម៉ោងសិក្សា (`១០០ នាទី`)**: Step 1 (`៥ នាទី`) + Step 2 (`១០ នាទី`) + Step 3 (`៥៥ នាទី`: E1 `៨`, E2 `២២`, E3 `២៥`) + Step 4 (`២២ នាទី`: E4 `១២`, E5 `១០`) + Step 5 (`៨ នាទី`) = `១០០ នាទី`.

### 5. Publication-Grade LaTeX Mathematics (KaTeX) — Mandatory
- **ALL mathematical expressions MUST look like genuine compiled LaTeX** using **KaTeX v0.16.11** (`katex.min.css`, `katex.min.js`, `auto-render.min.js`).
- **NEVER** write plain ASCII or unformatted HTML math (`a = b * q + r`, `x^2`, `3/4`, `<=`, `!=`, or `<i>a = b × q</i>`).
- Write every inline expression inside `$...$` and key definitions/theorems/formulas as centered display equations inside `$$...$$`:
  - Arithmetic & Number Theory: `$a = b \times q + r$`, `$0 \le r < b$`, `$2\,508 \div 12 = 209$`, `$b \neq 0$`
  - Fractions & Roots: `$\dfrac{a}{b}$` (prefer `\dfrac` for clear legibility), `$\sqrt{x^2 + y^2}$`, `$\sqrt[3]{27} = 3$`
  - Algebra & Systems: `$$\begin{cases} 2x + y = 7 \\ x - y = 2 \end{cases}$$`
  - Geometry & Vectors: `$\triangle ABC$`, `$\widehat{ABC} = 90^\circ$`, `$\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$`, `$AB \parallel CD$`, `$AB \perp BC$`
  - Calculus & Functions: `$\lim_{x \to 0} \dfrac{\sin x}{x} = 1$`, `$f'(x)$`, `$\displaystyle\int_a^b f(x)\,dx$`
- For Cambodian vertical Euclidean division (`ប្រមាណវិធីចែកបញ្ឈរ`), use `.potence-table` (inside `.layout-pair-table` when side-by-side) with `$...$` KaTeX math in every cell so both the potence lines and Computer Modern numerals look crisp in PDF and Word.
- Always run a quick delimiter check (`node` script checking balanced `$` and `$$`) and verify every calculation mathematically before finalizing.

### 6. Mobile-Friendly Deployment & Delivery
- The user frequently accesses lesson plans from a **mobile phone** and cannot open `localhost`:
  - Keep `scripts/app.js` active so the `297mm` A4 Landscape page automatically scales to fit mobile screens while printing/exporting true A4 Landscape pages, and converts `.katex` annotations cleanly when exporting `.doc` files (preventing duplicate MathML/HTML text in Word).
  - When working in a connected GitHub Pages repository (such as `davann2806-cmd/lesson-plan`), commit and push changes, trigger/verify the GitHub Pages build (`gh api -X POST repos/<owner>/<repo>/pages/builds`), and provide an actionable `.url.json` bookmark (`UserFacing: true`) to the public `github.io` page.
  - If no GitHub Pages repo is desired, create a self-contained `.html` artifact in the artifact directory with `UserFacing: true`.
