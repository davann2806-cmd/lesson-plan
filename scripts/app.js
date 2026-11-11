/**
 * កម្មវិធីគ្រប់គ្រងកិច្ចតែងការបង្រៀនគណិតវិទ្យា — បំបែកសន្លឹកក្រដាស A4 ផ្ដេកដាច់ៗពីគ្នាដូចពេលបោះពុម្ព (1:1 WYSIWYG Paginator)
 * + រូបមន្តគណិតវិទ្យាស្តង់ដារ LaTeX (KaTeX) + ទាញយកជា Microsoft Word (.doc)
 */

(function () {
  'use strict';

  const shellEl = document.getElementById('page-scale-shell');
  const initialArticle = document.getElementById('lesson-document');
  const btnPrint = document.getElementById('btn-print');
  const btnWord = document.getElementById('btn-export-word');
  const btnEdit = document.getElementById('btn-toggle-edit');
  const btnZoom = document.getElementById('btn-toggle-zoom');
  const pageCountEl = document.getElementById('page-count-badge');

  if (!shellEl || !initialArticle) return;

  // Ensure a .pages-stack wrapper holds all discrete .a4-page sheets
  let stackEl = document.getElementById('pages-stack');
  if (!stackEl) {
    stackEl = document.createElement('div');
    stackEl.id = 'pages-stack';
    stackEl.className = 'pages-stack';
    initialArticle.parentNode.insertBefore(stackEl, initialArticle);
    stackEl.appendChild(initialArticle);
  }

  const docFilename =
    initialArticle.getAttribute('data-filename') || 'កិច្ចតែងការបង្រៀនគណិតវិទ្យា_5E.doc';
  const docAriaLabel =
    initialArticle.getAttribute('aria-label') || 'កិច្ចតែងការបង្រៀនគណិតវិទ្យា';

  // Store the master unsplit HTML source of truth
  let masterHtml = initialArticle.innerHTML;
  let fitToScreen = true;
  let editMode = false;

  const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

  function toKhmerNum(num) {
    return String(num)
      .split('')
      .map((ch) => (ch >= '0' && ch <= '9' ? KHMER_DIGITS[Number(ch)] : ch))
      .join('');
  }

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

  /**
   * គណនាមាត្រដ្ឋានបង្រួមសមអេក្រង់ទូរសព្ទ ឬកុំព្យូទ័រ (រក្សាចន្លោះដាច់ៗរវាងសន្លឹកក្រដាសនីមួយៗ)
   */
  function updatePageScale() {
    shellEl.style.transform = 'none';
    shellEl.style.height = 'auto';

    if (!fitToScreen) return;

    const firstSheet = stackEl.querySelector('.a4-page');
    if (!firstSheet) return;

    const availableWidth = Math.max(280, document.documentElement.clientWidth - 20);
    const naturalWidth = firstSheet.offsetWidth;
    const naturalStackHeight = stackEl.offsetHeight;

    if (naturalWidth > 0 && availableWidth < naturalWidth) {
      const scale = availableWidth / naturalWidth;
      shellEl.style.transform = `scale(${scale.toFixed(4)})`;
      shellEl.style.height = `${Math.ceil(naturalStackHeight * scale)}px`;
    }
  }

  /**
   * បង្កើតសន្លឹកក្រដាស A4 Landscape ថ្មីមួយសន្លឹកដាច់ដោយឡែក
   */
  function createBlankSheet() {
    const sheet = document.createElement('article');
    sheet.className = 'a4-page';
    sheet.setAttribute('aria-label', docAriaLabel);

    const body = document.createElement('div');
    body.className = 'a4-page-body';
    sheet.appendChild(body);

    const footer = document.createElement('footer');
    footer.className = 'page-footer';
    footer.innerHTML =
      '<span class="page-footer-label">កិច្ចតែងការបង្រៀន — អនុវិទ្យាល័យព្រះក្រសាំង</span>' +
      '<span class="page-footer-num"></span>';
    sheet.appendChild(footer);

    stackEl.appendChild(sheet);

    const cs = window.getComputedStyle(sheet);
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padBottom = parseFloat(cs.paddingBottom) || 0;
    const maxBodyHeight = Math.floor(sheet.clientHeight - padTop - padBottom - 1);

    return { sheet, body, maxBodyHeight };
  }

  function createEmptyTableFromMaster(masterTable) {
    const table = document.createElement('table');
    table.className = masterTable.className || 'lesson-table';

    const colgroup = masterTable.querySelector('colgroup');
    if (colgroup) {
      table.appendChild(colgroup.cloneNode(true));
    }

    const thead = masterTable.querySelector('thead');
    if (thead) {
      table.appendChild(thead.cloneNode(true));
    }

    const tbody = document.createElement('tbody');
    tbody.className = 'editable-region';
    table.appendChild(tbody);

    return { table, tbody };
  }

  /**
   * បំបែកជួរតារាង (<tr>) ដែលវែងជាង ១ ទំព័រពេញ ឱ្យដាច់ជា ២ ផ្នែកយ៉ាងស្អាតដោយមិនបាត់អត្ថបទ
   */
  function splitOversizedRow(row, currentTbody, currentBody, maxBodyHeight) {
    const part1Row = document.createElement('tr');
    const part2Row = document.createElement('tr');

    const srcCells = Array.from(row.children);
    srcCells.forEach((cell) => {
      const c1 = cell.cloneNode(false);
      const c2 = cell.cloneNode(false);
      part1Row.appendChild(c1);
      part2Row.appendChild(c2);
    });

    currentTbody.appendChild(part1Row);
    let placedAnything = false;

    srcCells.forEach((srcCell, colIdx) => {
      const dst1 = part1Row.children[colIdx];
      const dst2 = part2Row.children[colIdx];
      const children = Array.from(srcCell.childNodes).filter(
        (n) => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim())
      );

      let overflowedCol = false;

      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (overflowedCol) {
          dst2.appendChild(node.cloneNode(true));
          continue;
        }

        const candidate = node.cloneNode(true);
        dst1.appendChild(candidate);

        if (currentBody.offsetHeight <= maxBodyHeight) {
          placedAnything = true;
        } else {
          dst1.removeChild(candidate);

          // If this child is a <ul>/<ol> list, try splitting individual <li> items
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.tagName === 'UL' || node.tagName === 'OL')
          ) {
            const list1 = node.cloneNode(false);
            const list2 = node.cloneNode(false);
            dst1.appendChild(list1);

            const items = Array.from(node.children);
            let listOverflowed = false;
            items.forEach((li) => {
              if (listOverflowed) {
                list2.appendChild(li.cloneNode(true));
                return;
              }
              const liClone = li.cloneNode(true);
              list1.appendChild(liClone);
              if (currentBody.offsetHeight <= maxBodyHeight) {
                placedAnything = true;
              } else {
                list1.removeChild(liClone);
                listOverflowed = true;
                list2.appendChild(li.cloneNode(true));
              }
            });

            if (list1.children.length === 0) {
              dst1.removeChild(list1);
            }
            if (list2.children.length > 0) {
              dst2.appendChild(list2);
            }
          } else if (!placedAnything && colIdx === 0 && i === 0) {
            // Failsafe: guarantee progress if a single atomic block exceeds maxBodyHeight
            dst1.appendChild(candidate);
            placedAnything = true;
          } else {
            dst2.appendChild(node.cloneNode(true));
          }

          overflowedCol = true;
        }
      }
    });

    const hasRemaining = Array.from(part2Row.children).some(
      (td) => td.childNodes.length > 0 && td.textContent.trim().length > 0
    );

    return hasRemaining ? part2Row : null;
  }

  /**
   * បំបែកឯកសារទាំងមូលទៅជាសន្លឹកក្រដាស A4 ផ្ដេកដាច់ៗពីគ្នា (100% ដូចពេលបោះពុម្ព Print/PDF)
   */
  function paginateDocument() {
    if (editMode) return;

    shellEl.style.transform = 'none';
    shellEl.style.height = 'auto';

    // Prepare rendered master source with KaTeX math
    const masterContainer = document.createElement('div');
    masterContainer.innerHTML = masterHtml;
    renderLatexMath(masterContainer);

    stackEl.innerHTML = '';
    let pageCtx = createBlankSheet();

    const topElements = Array.from(masterContainer.children);

    for (let idx = 0; idx < topElements.length; idx++) {
      const el = topElements[idx];

      // 1. Metadata section (.meta-section with table.meta-table)
      if (el.classList.contains('meta-section')) {
        const wholeClone = el.cloneNode(true);
        pageCtx.body.appendChild(wholeClone);

        if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
          continue;
        }

        pageCtx.body.removeChild(wholeClone);
        const srcMetaTable = el.querySelector('table.meta-table');
        if (!srcMetaTable) {
          pageCtx = createBlankSheet();
          pageCtx.body.appendChild(wholeClone);
          continue;
        }

        const buildEmptyMetaSection = () => {
          const sec = document.createElement('section');
          sec.className = el.className;
          const tbl = document.createElement('table');
          tbl.className = srcMetaTable.className;
          const cg = srcMetaTable.querySelector('colgroup');
          if (cg) tbl.appendChild(cg.cloneNode(true));
          const tb = document.createElement('tbody');
          tbl.appendChild(tb);
          sec.appendChild(tbl);
          return { sec, tb };
        };

        let metaCtx = buildEmptyMetaSection();
        pageCtx.body.appendChild(metaCtx.sec);

        const metaRows = Array.from(srcMetaTable.querySelectorAll('tbody > tr'));
        metaRows.forEach((tr) => {
          const trClone = tr.cloneNode(true);
          metaCtx.tb.appendChild(trClone);
          if (pageCtx.body.offsetHeight > pageCtx.maxBodyHeight && metaCtx.tb.children.length > 1) {
            metaCtx.tb.removeChild(trClone);
            pageCtx = createBlankSheet();
            metaCtx = buildEmptyMetaSection();
            pageCtx.body.appendChild(metaCtx.sec);
            metaCtx.tb.appendChild(trClone);
          }
        });
        continue;
      }

      // 2. Main 3-Column × 5-Step Lesson Table (table.lesson-table)
      if (el.tagName === 'TABLE' && el.classList.contains('lesson-table')) {
        const srcTbody = el.querySelector('tbody');
        if (!srcTbody) continue;

        const rowQueue = Array.from(srcTbody.children).map((r) => r.cloneNode(true));
        let tblCtx = null;

        const ensureTable = () => {
          if (!tblCtx) {
            tblCtx = createEmptyTableFromMaster(el);
            pageCtx.body.appendChild(tblCtx.table);
          }
          return tblCtx;
        };

        const discardEmptyTable = () => {
          if (tblCtx && tblCtx.tbody.children.length === 0) {
            if (tblCtx.table.parentNode === pageCtx.body) {
              pageCtx.body.removeChild(tblCtx.table);
            }
            tblCtx = null;
          }
        };

        while (rowQueue.length > 0) {
          const row = rowQueue.shift();
          const isStepBanner = Boolean(row.querySelector('.step-banner-cell'));

          // Prevent orphan Step Banner: always pair Step Banner with its first content row
          if (isStepBanner && rowQueue.length > 0 && !rowQueue[0].querySelector('.step-banner-cell')) {
            const firstContentRow = rowQueue.shift();
            const activeTbl = ensureTable();

            activeTbl.tbody.appendChild(row);
            activeTbl.tbody.appendChild(firstContentRow);

            if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
              continue;
            }

            // Didn't fit together on current sheet
            activeTbl.tbody.removeChild(firstContentRow);
            activeTbl.tbody.removeChild(row);
            discardEmptyTable();

            // If current sheet already had content, start a fresh sheet and retry
            if (pageCtx.body.children.length > 0) {
              pageCtx = createBlankSheet();
              tblCtx = null;
            }

            const freshTbl = ensureTable();
            freshTbl.tbody.appendChild(row);
            freshTbl.tbody.appendChild(firstContentRow);

            if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
              continue;
            }

            // Even on a fresh sheet, banner + huge content row exceeds 1 page:
            // Keep banner on this fresh sheet and split firstContentRow cleanly!
            freshTbl.tbody.removeChild(firstContentRow);
            const leftover = splitOversizedRow(
              firstContentRow,
              freshTbl.tbody,
              pageCtx.body,
              pageCtx.maxBodyHeight
            );
            if (leftover) {
              rowQueue.unshift(leftover);
            }
            pageCtx = createBlankSheet();
            tblCtx = null;
            continue;
          }

          // Standard content row
          const activeTbl = ensureTable();
          activeTbl.tbody.appendChild(row);

          if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
            continue;
          }

          // Row overflowed current sheet
          activeTbl.tbody.removeChild(row);
          discardEmptyTable();

          if (pageCtx.body.children.length > 0) {
            pageCtx = createBlankSheet();
            tblCtx = null;
          }

          const freshTbl = ensureTable();
          freshTbl.tbody.appendChild(row);

          if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
            continue;
          }

          // Row alone exceeds a full blank sheet -> split across sheets
          freshTbl.tbody.removeChild(row);
          const leftover = splitOversizedRow(
            row,
            freshTbl.tbody,
            pageCtx.body,
            pageCtx.maxBodyHeight
          );
          if (leftover) {
            rowQueue.unshift(leftover);
            pageCtx = createBlankSheet();
            tblCtx = null;
          }
        }

        discardEmptyTable();
        continue;
      }

      // 3. Generic top-level blocks (Header blocks, Reflection box, Signature table)
      const blockClone = el.cloneNode(true);
      pageCtx.body.appendChild(blockClone);

      if (pageCtx.body.offsetHeight > pageCtx.maxBodyHeight && pageCtx.body.children.length > 1) {
        pageCtx.body.removeChild(blockClone);
        pageCtx = createBlankSheet();
        pageCtx.body.appendChild(blockClone);
      }
    }

    // Remove trailing empty sheet if created unnecessarily
    const allSheets = Array.from(stackEl.querySelectorAll('.a4-page'));
    if (allSheets.length > 1) {
      const last = allSheets[allSheets.length - 1];
      const lastBody = last.querySelector('.a4-page-body');
      if (lastBody && lastBody.children.length === 0) {
        stackEl.removeChild(last);
        allSheets.pop();
      }
    }

    // Stamp official page numbers on each sheet footer + toolbar pill
    const totalPages = allSheets.length;
    allSheets.forEach((sheet, idx) => {
      const numEl = sheet.querySelector('.page-footer-num');
      if (numEl) {
        numEl.textContent = `ទំព័រទី ${toKhmerNum(idx + 1)} / ${toKhmerNum(totalPages)}`;
      }
    });

    if (pageCountEl) {
      pageCountEl.textContent = `📄 ${toKhmerNum(totalPages)} ទំព័រ (ក្រដាសផ្ដេក A4)`;
    }

    updatePageScale();
  }

  /**
   * មុខងារបើក/បិទការកែសម្រួលអត្ថបទផ្ទាល់ រួចបំបែកជាសន្លឹកក្រដាស A4 ដាច់ៗពីគ្នាឡើងវិញដោយស្វ័យប្រវត្តិ
   */
  function setEditable(enabled) {
    editMode = enabled;
    if (btnEdit) {
      btnEdit.classList.toggle('is-active', enabled);
      btnEdit.textContent = enabled
        ? '✓ រក្សាទុក & បំបែកសន្លឹកក្រដាស'
        : '✏️ កែសម្រួលលើទម្រង់';
    }

    if (enabled) {
      shellEl.style.transform = 'none';
      shellEl.style.height = 'auto';
      stackEl.innerHTML = '';

      const editSheet = document.createElement('article');
      editSheet.className = 'a4-page a4-page-edit-mode show-edit-guides';
      editSheet.setAttribute('aria-label', docAriaLabel);

      const banner = document.createElement('div');
      banner.className = 'edit-mode-banner no-print';
      banner.textContent =
        'របៀបកែសម្រួល៖ កែអត្ថបទ ឬកូដគណិតវិទ្យា LaTeX ($...$) រួចចុចប៊ូតុង «✓ រក្សាទុក & បំបែកសន្លឹកក្រដាស» ដើម្បីរៀបជាសន្លឹកក្រដាស A4 ដាច់ៗពីគ្នាឡើងវិញ។';
      editSheet.appendChild(banner);

      const editBody = document.createElement('div');
      editBody.id = 'editable-master-body';
      editBody.innerHTML = masterHtml;
      renderLatexMath(editBody);

      editBody.querySelectorAll('.editable-region').forEach((el) => {
        el.setAttribute('contenteditable', 'true');
      });

      editSheet.appendChild(editBody);
      stackEl.appendChild(editSheet);
      updatePageScale();
    } else {
      const editBody = document.getElementById('editable-master-body');
      if (editBody) {
        editBody.querySelectorAll('[contenteditable]').forEach((el) => {
          el.removeAttribute('contenteditable');
        });
        // Restore raw TeX delimiters from existing KaTeX spans before saving masterHtml
        editBody.querySelectorAll('.katex-display').forEach((dispEl) => {
          const ann = dispEl.querySelector('annotation[encoding="application/x-tex"]');
          if (ann) {
            dispEl.replaceWith(document.createTextNode(`$$${ann.textContent}$$`));
          }
        });
        editBody.querySelectorAll('.katex').forEach((kEl) => {
          const ann = kEl.querySelector('annotation[encoding="application/x-tex"]');
          if (ann) {
            kEl.replaceWith(document.createTextNode(`$${ann.textContent}$`));
          }
        });
        masterHtml = editBody.innerHTML;
      }
      paginateDocument();
    }
  }

  /**
   * បម្លែងកន្សោម LaTeX ពី KaTeX annotation ទៅជាទម្រង់ Cambria Math សម្រាប់ឯកសារ Microsoft Word (.doc)
   */
  function texToWordHtml(rawTex, isDisplay) {
    let s = rawTex.trim();

    s = s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/\\text\{([^{}]*)\}/g, '<span class="word-mtext">$1</span>');
    s = s.replace(/\\textbf\{([^{}]*)\}/g, '<b>$1</b>');
    s = s.replace(/\\mathbf\{([^{}]*)\}/g, '<b>$1</b>');

    for (let i = 0; i < 2; i++) {
      s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
    }

    s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
    s = s.replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>');
    s = s.replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>');
    s = s.replace(/\^([0-9a-zA-Z])/g, '<sup>$1</sup>');
    s = s.replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>');

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
      [/\\implies|\\Rightarrow/g, ' ⇒ '],
      [/\\Longleftrightarrow|\\Leftrightarrow/g, ' ⇔ '],
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
      [/\\widehat\{([^{}]*)\}/g, '∠$1'],
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

    s = s.replace(/(^|[^a-zA-Z0-9&;/])([a-zA-Z])(?=[^a-zA-Z0-9>]|$)/g, '$1<i>$2</i>');

    if (isDisplay) {
      return `<div class="word-math-display">${s}</div>`;
    }
    return `<span class="word-math-inline">${s}</span>`;
  }

  function convertKatexForWord(rootClone) {
    rootClone.querySelectorAll('.katex-display').forEach((dispEl) => {
      const ann = dispEl.querySelector('annotation[encoding="application/x-tex"]');
      if (ann) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = texToWordHtml(ann.textContent || '', true);
        dispEl.replaceWith(wrapper.firstElementChild);
      }
    });

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
    if (editMode) {
      setEditable(false);
    }

    const exportRoot = document.createElement('div');
    exportRoot.innerHTML = masterHtml;
    renderLatexMath(exportRoot);
    convertKatexForWord(exportRoot);

    const wordStyles = `
      @page WordSection1 {
        size: 841.9pt 595.3pt;
        mso-page-orientation: landscape;
        margin: 36.8pt 39.7pt 39.7pt 51.0pt;
        mso-header-margin: 35.4pt;
        mso-footer-margin: 35.4pt;
      }
      div.WordSection1 { page: WordSection1; }
      body {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 10.5pt;
        color: #000000;
        line-height: 1.55;
      }
      .kingdom-motto, .doc-title-block { text-align: center; }
      .muol-heading, .doc-main-title, .sig-role-muol {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
      }
      .doc-sub-title { font-style: italic; text-align: center; }
      .meta-section { margin-left: 22.7pt; margin-bottom: 10pt; }
      table.meta-table { width: 100%; border-collapse: collapse; border: none; table-layout: fixed; }
      table.meta-table td { border: none; padding: 1.5pt 0; vertical-align: top; font-family: "Khmer OS Siemreap", "Hanuman", serif; font-size: 10.2pt; }
      table.meta-table td.meta-label-cell { width: 147.4pt; font-weight: bold; white-space: nowrap; padding-right: 6pt; }
      table.meta-table tr.meta-sub-row td.meta-label-cell { padding-left: 17pt; }
      .meta-colon { font-weight: bold; margin-right: 3pt; }
      table.lesson-table {
        width: 100%;
        border-collapse: collapse;
        border: 1pt solid #000000;
        mso-border-alt: solid windowtext .75pt;
        mso-yfti-tbllook: 1184;
      }
      table.lesson-table thead { display: table-header-group; }
      table.lesson-table tr { page-break-inside: avoid; }
      table.lesson-table th, table.lesson-table td {
        border: 1pt solid #000000;
        padding: 5pt 6pt;
        vertical-align: top;
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 10.2pt;
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
        font-size: 10.8pt;
      }
      .word-math-display {
        font-family: "Cambria Math", "Times New Roman", serif;
        font-size: 11.2pt;
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

    const docHtml =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
      'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
      'xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><meta charset="utf-8"><title>កិច្ចតែងការបង្រៀនគណិតវិទ្យា</title>' +
      `<style>${wordStyles}</style></head>` +
      `<body><div class="WordSection1">${exportRoot.innerHTML}</div></body></html>`;

    const blob = new Blob(['\ufeff', docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      if (editMode) {
        setEditable(false);
      }
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
    if (editMode) {
      setEditable(false);
    }
    shellEl.style.transform = 'none';
    shellEl.style.height = 'auto';
  });
  window.addEventListener('afterprint', updatePageScale);

  function scheduleRepaginate() {
    if (!editMode) {
      paginateDocument();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    scheduleRepaginate();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleRepaginate);
    }
  });

  window.addEventListener('load', () => {
    scheduleRepaginate();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleRepaginate);
    }
  });
})();
