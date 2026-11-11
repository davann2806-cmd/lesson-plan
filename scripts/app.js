/**
 * កម្មវិធីគ្រប់គ្រងទម្រង់កិច្ចតែងការបង្រៀនគណិតវិទ្យា (Microsoft Word A4 Print & Export)
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

    // Reset first to measure natural A4 dimensions
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

    const wordStyles = `
      @page WordSection1 {
        size: 595.3pt 841.9pt;
        margin: 42.55pt 42.55pt 42.55pt 56.7pt;
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
      .muol-heading, .doc-main-title, .section-heading-kh, .sig-role-muol {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
      }
      .doc-sub-title { font-style: italic; text-align: center; }
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
        background: #F9F9F9;
      }
      .phase-5e-badge { font-weight: bold; text-decoration: underline; }
      .reflection-box { border: 1pt solid #000000; padding: 6pt 8pt; margin-top: 10pt; }
      .signature-table { width: 100%; border: none; margin-top: 14pt; text-align: center; }
      .signature-table td { border: none; width: 50%; text-align: center; vertical-align: top; }
    `;

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
    link.download = 'ទម្រង់កិច្ចតែងការបង្រៀនគណិតវិទ្យា_5E.doc';
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
