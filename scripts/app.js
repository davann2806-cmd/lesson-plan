/**
 * កម្មវិធីគ្រប់គ្រងកិច្ចតែងការបង្រៀនគណិតវិទ្យា — ក្រដាសផ្ដេក A4 Landscape (Print & Word .doc Export)
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
    btnEdit.textContent = enabled ? '✓ កំពុងបើកកែសម្រួល' : '✏️ កែសម្រួលលើទម្រង់';

    const editTargets = pageEl.querySelectorAll('.editable-region');
    editTargets.forEach((el) => {
      el.setAttribute('contenteditable', enabled ? 'true' : 'false');
    });
    updatePageScale();
  }

  function exportToWordDoc() {
    const clone = pageEl.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach((el) => {
      el.removeAttribute('contenteditable');
    });

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
      .math-formula { font-family: "Cambria Math", "Times New Roman", serif; font-weight: bold; text-align: center; font-size: 11.5pt; }
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
    updatePageScale();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updatePageScale);
    }
  });
})();
