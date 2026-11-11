/**
 * កម្មវិធីគ្រប់គ្រងកិច្ចតែងការបង្រៀនគណិតវិទ្យា — ក្រដាសផ្ដេក A4 Landscape + LaTeX (KaTeX) + Word (.doc) Export
 */

(function () {
  'use strict';

  const pageEl = document.getElementById('lesson-document');
  const shellEl = document.getElementById('page-scale-shell');
  const btnPrint = document.getElementById('btn-print');
  const btnWord = document.getElementById('btn-export-word');
  const btnEdit = document.getElementById('btn-toggle-edit');
  const btnZoom = document.getElementById('btn-toggle-zoom');

  let fitToScreen = true;
  let editMode = false;

  const KATEX_DELIMITERS = [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false }
  ];

  function renderLatexMath(targetEl) {
    if (!targetEl || typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(targetEl, {
      delimiters: KATEX_DELIMITERS,
      throwOnError: false,
      strict: false
    });
  }

  function updatePageScale() {
    if (!pageEl || !shellEl) return;

    shellEl.style.transform = 'none';
    shellEl.style.height = 'auto';

    if (!fitToScreen) {
      return;
    }

    const availableWidth = Math.max(280, document.documentElement.clientWidth - 20);
    const naturalWidth = pageEl.offsetWidth;
    const naturalHeight = pageEl.offsetHeight;

    if (naturalWidth > 0 && availableWidth < naturalWidth) {
      const scale = availableWidth / naturalWidth;
      shellEl.style.transform = `scale(${scale.toFixed(4)})`;
      shellEl.style.height = `${Math.ceil(naturalHeight * scale)}px`;
    }
  }

  function setEditable(enabled) {
    editMode = enabled;
    pageEl.classList.toggle('show-edit-guides', enabled);
    btnEdit.classList.toggle('is-active', enabled);
    btnEdit.textContent = enabled ? '✓ រក្សាទុក & បង្ហាញ LaTeX' : '✏️ កែសម្រួលលើទម្រង់';

    const editTargets = pageEl.querySelectorAll('.editable-region');
    editTargets.forEach((el) => {
      el.setAttribute('contenteditable', enabled ? 'true' : 'false');
    });

    if (!enabled) {
      renderLatexMath(pageEl);
    }
    updatePageScale();
  }

  /**
   * បម្លែងកន្សោម LaTeX ពី KaTeX annotation ទៅជាទម្រង់ Cambria Math សម្រាប់ឯកសារ Microsoft Word (.doc)
   * ដើម្បីកុំឱ្យស្ទួនអក្សរ (.katex-mathml + .katex-html) ពេលបើកក្នុងកម្មវិធី Word
   */
  function texToWordHtml(rawTex, isDisplay) {
    let s = rawTex.trim();

    // Escape HTML special chars first
    s = s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Text blocks inside LaTeX: \text{...}
    s = s.replace(/\\text\{([^{}]*)\}/g, '<span class="word-mtext">$1</span>');
    s = s.replace(/\\textbf\{([^{}]*)\}/g, '<b>$1</b>');
    s = s.replace(/\\mathbf\{([^{}]*)\}/g, '<b>$1</b>');

    // Fractions: \dfrac{a}{b} or \frac{a}{b}
    for (let i = 0; i < 2; i++) {
      s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
    }

    // Roots: \sqrt{x}
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');

    // Superscripts & subscripts: ^{...}, _{...}, ^2, _1
    s = s.replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>');
    s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>');
    s = s.replace(/\^([0-9a-zA-Z])/g, '<sup>$1</sup>');
    s = s.replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>');

    // Spacing & common LaTeX math symbols
    const symbolMap = [
      [/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'],
      [/\\quad/g, '&nbsp;&nbsp;&nbsp;&nbsp;'],
      [/\\,/g, '&thinsp;'],
      [/\\;/g, '&nbsp;'],
      [/\\:/g, '&nbsp;'],
      [/\\!/g, ''],
      [/\\times/g, ' × '],
      [/\\div/g, ' ÷ '],
      [/\\cdot/g, ' · '],
      [/\\pm/g, ' ± '],
      [/\\mp/g, ' ∓ '],
      [/\\le|\\leq/g, ' ≤ '],
      [/\\ge|\\geq/g, ' ≥ '],
      [/\\neq|\\ne/g, ' ≠ '],
      [/\\approx/g, ' ≈ '],
      [/\\equiv/g, ' ≡ '],
      [/\\Rightarrow/g, ' ⇒ '],
      [/\\Leftrightarrow/g, ' ⇔ '],
      [/\\rightarrow|\\to/g, ' → '],
      [/\\in/g, ' ∈ '],
      [/\\notin/g, ' ∉ '],
      [/\\subset/g, ' ⊂ '],
      [/\\subseteq/g, ' ⊆ '],
      [/\\cup/g, ' ∪ '],
      [/\\cap/g, ' ∩ '],
      [/\\emptyset/g, '∅'],
      [/\\infty/g, '∞'],
      [/\\pi/g, 'π'],
      [/\\alpha/g, 'α'],
      [/\\beta/g, 'β'],
      [/\\gamma/g, 'γ'],
      [/\\theta/g, 'θ'],
      [/\\Delta/g, 'Δ'],
      [/\\triangle/g, '△'],
      [/\\angle/g, '∠'],
      [/\\circ/g, '°'],
      [/\\mathbb\{N\}/g, 'ℕ'],
      [/\\mathbb\{Z\}/g, 'ℤ'],
      [/\\mathbb\{Q\}/g, 'ℚ'],
      [/\\mathbb\{R\}/g, 'ℝ'],
      [/\\left/g, ''],
      [/\\right/g, ''],
      [/\\\{/g, '{'],
      [/\\\}/g, '}']
    ];

    symbolMap.forEach(([regex, replacement]) => {
      s = s.replace(regex, replacement);
    });

    // Italicize single Latin math variables outside HTML tags
    s = s.replace(/(^|[^a-zA-Z0-9&;/])([a-zA-Z])(?=[^a-zA-Z0-9>]|$)/g, '$1<i>$2</i>');

    if (isDisplay) {
      return `<div class="word-math-display">${s}</div>`;
    }
    return `<span class="word-math-inline">${s}</span>`;
  }

  function convertKatexForWord(rootClone) {
    // Convert display math blocks first
    rootClone.querySelectorAll('.katex-display').forEach((dispEl) => {
      const ann = dispEl.querySelector('annotation[encoding="application/x-tex"]');
      if (ann) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = texToWordHtml(ann.textContent || '', true);
        dispEl.replaceWith(wrapper.firstElementChild);
      }
    });

    // Convert remaining inline .katex spans
    rootClone.querySelectorAll('.katex').forEach((katexEl) => {
      const ann = katexEl.querySelector('annotation[encoding="application/x-tex"]');
      if (ann) {
        const wrapper = document.createElement('span');
        wrapper.innerHTML = texToWordHtml(ann.textContent || '', false);
        katexEl.replaceWith(wrapper.firstElementChild);
      }
    });
  }

  function exportToWordDoc() {
    const clone = pageEl.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach((el) => {
      el.removeAttribute('contenteditable');
    });

    convertKatexForWord(clone);

    // A4 Landscape MSO Page Setup: 841.9pt × 595.3pt
    const wordStyles = `
      @page WordSection1 {
        size: 841.9pt 595.3pt;
        mso-page-orientation: landscape;
        margin: 39.7pt 39.7pt 39.7pt 51.0pt;
        mso-header-margin: 35.4pt;
        mso-footer-margin: 35.4pt;
      }
      div.WordSection1 { page: WordSection1; }
      body {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 11pt;
        color: #000000;
        line-height: 1.55;
      }
      .kingdom-motto, .doc-title-block { text-align: center; }
      .muol-heading, .doc-main-title, .sig-role-muol {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
      }
      .doc-sub-title { font-style: italic; text-align: center; }
      ul.dash-list, ul.sub-plus-list { list-style-type: none; margin: 0; padding: 0; }
      ul.dash-list > li { margin-bottom: 2.5pt; }
      ul.sub-plus-list { margin-left: 18pt; margin-top: 2pt; margin-bottom: 3pt; }
      ul.sub-plus-list > li { margin-bottom: 2pt; }
      .meta-label { font-weight: bold; }
      table.lesson-table {
        width: 100%;
        border-collapse: collapse;
        border: 1pt solid #000000;
        mso-border-alt: solid windowtext .75pt;
        mso-yfti-tbllook: 1184;
      }
      table.lesson-table th, table.lesson-table td {
        border: 1pt solid #000000;
        padding: 5pt 6pt;
        vertical-align: top;
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 10.5pt;
      }
      table.lesson-table thead th {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
        text-align: center;
        background: #F2F2F2;
      }
      .step-banner-cell {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
        text-align: center;
        background: #F9F9F9;
      }
      .step-duration {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-weight: bold;
      }
      .phase-5e-badge { font-weight: bold; text-decoration: underline; }
      .math-box { border: 0.75pt solid #222222; padding: 5pt 7pt; margin: 4pt 0; background: #FCFCFC; }
      .word-math-inline {
        font-family: "Cambria Math", "Times New Roman", serif;
        font-size: 11pt;
      }
      .word-math-display {
        font-family: "Cambria Math", "Times New Roman", serif;
        font-size: 11.5pt;
        text-align: center;
        margin: 5pt 0;
        font-weight: normal;
      }
      .word-mtext {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
      }
      table.layout-pair-table { width: 100%; border-collapse: collapse; border: none; margin: 3pt 0; }
      table.layout-pair-table > tbody > tr > td { border: none; padding: 2pt 4pt; vertical-align: top; width: 50%; }
      table.potence-table { border-collapse: collapse; border: none; margin: 4pt 0; }
      table.potence-table td { border: none; padding: 1.5pt 5pt; font-family: "Cambria Math", "Times New Roman", serif; }
      table.potence-table td.pot-left { text-align: right; border-right: 1pt solid #000000; }
      table.potence-table td.pot-divisor { text-align: left; border-bottom: 1pt solid #000000; font-weight: bold; }
      table.potence-table td.pot-quotient { text-align: left; font-weight: bold; }
      .potence-sub { border-bottom: 0.75pt solid #000000; }
      .reflection-box { border: 1pt solid #000000; padding: 6pt 8pt; margin-top: 10pt; }
      .signature-table { width: 100%; border: none; margin-top: 14pt; text-align: center; }
      .signature-table td { border: none; width: 50%; text-align: center; vertical-align: top; }
    `;

    const customFilename = pageEl.getAttribute('data-filename') || 'កិច្ចតែងការបង្រៀនគណិតវិទ្យា_5E.doc';

    const docHtml =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
      'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
      'xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><meta charset="utf-8"><title>កិច្ចតែងការបង្រៀនគណិតវិទ្យា</title>' +
      `<style>${wordStyles}</style></head>` +
      `<body><div class="WordSection1">${clone.innerHTML}</div></body></html>`;

    const blob = new Blob(['\ufeff', docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = customFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      shellEl.style.transform = 'none';
      shellEl.style.height = 'auto';
      window.print();
      setTimeout(updatePageScale, 300);
    });
  }

  if (btnWord) {
    btnWord.addEventListener('click', exportToWordDoc);
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => setEditable(!editMode));
  }

  if (btnZoom) {
    btnZoom.addEventListener('click', () => {
      fitToScreen = !fitToScreen;
      btnZoom.textContent = fitToScreen ? '🔍 ទំហំដើម 100%' : '📱 បង្រួមសមអេក្រង់';
      updatePageScale();
    });
  }

  window.addEventListener('resize', updatePageScale);
  window.addEventListener('beforeprint', () => {
    shellEl.style.transform = 'none';
    shellEl.style.height = 'auto';
  });
  window.addEventListener('afterprint', updatePageScale);

  window.addEventListener('DOMContentLoaded', () => {
    renderLatexMath(pageEl);
    updatePageScale();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updatePageScale);
    }
  });
})();
