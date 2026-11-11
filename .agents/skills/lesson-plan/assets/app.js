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
   * បំបែកជួរតារាង (<tr>) ឱ្យពេញទំព័របច្ចុប្បន្នជាមុនសិន ទើបបន្តផ្នែកនៅសល់ទៅទំព័របន្ទាប់ដោយមិនខ្ជះខ្ជាយក្រដាស
   */
  function splitOversizedRow(row, currentTbody, currentBody, maxBodyHeight, allowForceFirst) {
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

          // Split <ul>/<ol> lists OR multi-div .math-box containers item-by-item
          const isSplittableContainer =
            node.nodeType === Node.ELEMENT_NODE &&
            (node.tagName === 'UL' ||
              node.tagName === 'OL' ||
              (node.tagName === 'DIV' &&
                node.classList.contains('math-box') &&
                node.children.length > 1));

          if (isSplittableContainer) {
            const box1 = node.cloneNode(false);
            const box2 = node.cloneNode(false);
            dst1.appendChild(box1);

            const items = Array.from(node.children);
            let subOverflowed = false;
            items.forEach((item) => {
              if (subOverflowed) {
                box2.appendChild(item.cloneNode(true));
                return;
              }
              const itemClone = item.cloneNode(true);
              box1.appendChild(itemClone);
              if (currentBody.offsetHeight <= maxBodyHeight) {
                placedAnything = true;
              } else {
                box1.removeChild(itemClone);
                subOverflowed = true;
                box2.appendChild(item.cloneNode(true));
              }
            });

            if (box1.children.length === 0) {
              dst1.removeChild(box1);
            }
            if (box2.children.length > 0) {
              dst2.appendChild(box2);
            }
          } else if (allowForceFirst && !placedAnything && colIdx === 0 && i === 0) {
            // Failsafe on an empty sheet: guarantee forward progress
            dst1.appendChild(candidate);
            placedAnything = true;
          } else {
            dst2.appendChild(node.cloneNode(true));
          }

          overflowedCol = true;
        }
      }

      // Avoid leaving any trailing sub-heading (<p><strong>...</strong></p> or .phase-5e-badge) orphaned at the bottom of a cell
      while (
        !allowForceFirst &&
        dst1.children.length >= 1 &&
        dst2.children.length > 0
      ) {
        const lastEl = dst1.lastElementChild;
        const isTrailingHeading =
          lastEl &&
          !lastEl.classList.contains('dots-line') &&
          (lastEl.classList.contains('phase-5e-badge') ||
            (lastEl.tagName === 'P' &&
              Boolean(lastEl.querySelector('strong')) &&
              lastEl.textContent.trim().length < 70));
        if (!isTrailingHeading) break;
        dst1.removeChild(lastEl);
        dst2.insertBefore(lastEl, dst2.firstChild);
      }
    });

    const contentColIdx = srcCells.length > 1 ? 1 : 0;
    const contentColHasText =
      part1Row.children[contentColIdx] &&
      part1Row.children[contentColIdx].textContent.trim().length > 0;

    if (!placedAnything || (!allowForceFirst && !contentColHasText)) {
      if (part1Row.parentNode === currentTbody) {
        currentTbody.removeChild(part1Row);
      }
      return { placed: false, leftover: null };
    }

    const hasRemaining = Array.from(part2Row.children).some(
      (td) => td.childNodes.length > 0 && td.textContent.trim().length > 0
    );

    return { placed: true, leftover: hasRemaining ? part2Row : null };
  }

  /**
   * បំបែកឯកសារទាំងមូលទៅជាសន្លឹកក្រដាស A4 ផ្ដេកដាច់ៗពីគ្នា និងប្រើប្រាស់ផ្ទៃក្រដាសឱ្យអស់លទ្ធភាព (100% ដូចពេលបោះពុម្ព Print/PDF)
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
    const MIN_REMAINING_SPLIT_PX = 48;

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

          // Prevent orphan Step Banner while still filling current sheet whenever possible
          if (isStepBanner && rowQueue.length > 0 && !rowQueue[0].querySelector('.step-banner-cell')) {
            const firstContentRow = rowQueue.shift();
            const activeTbl = ensureTable();

            activeTbl.tbody.appendChild(row);
            activeTbl.tbody.appendChild(firstContentRow);

            if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
              continue;
            }

            // Full firstContentRow didn't fit — check if banner + part of firstContentRow can fill current sheet!
            activeTbl.tbody.removeChild(firstContentRow);
            if (
              pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight &&
              pageCtx.maxBodyHeight - pageCtx.body.offsetHeight >= MIN_REMAINING_SPLIT_PX
            ) {
              const splitOnCurr = splitOversizedRow(
                firstContentRow,
                activeTbl.tbody,
                pageCtx.body,
                pageCtx.maxBodyHeight,
                false
              );
              if (splitOnCurr.placed) {
                if (splitOnCurr.leftover) {
                  rowQueue.unshift(splitOnCurr.leftover);
                  pageCtx = createBlankSheet();
                  tblCtx = null;
                }
                continue;
              }
            }

            // Otherwise move banner + firstContentRow together to a fresh sheet
            activeTbl.tbody.removeChild(row);
            discardEmptyTable();

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

            // Even on a fresh sheet, banner + huge content row exceeds 1 page: split cleanly
            freshTbl.tbody.removeChild(firstContentRow);
            const splitFresh = splitOversizedRow(
              firstContentRow,
              freshTbl.tbody,
              pageCtx.body,
              pageCtx.maxBodyHeight,
              true
            );
            if (splitFresh.leftover) {
              rowQueue.unshift(splitFresh.leftover);
            }
            pageCtx = createBlankSheet();
            tblCtx = null;
            continue;
          }

          // Standard content row: try fitting whole row on current sheet first
          const activeTbl = ensureTable();
          activeTbl.tbody.appendChild(row);

          if (pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight) {
            continue;
          }

          // Whole row overflowed current sheet — try splitting row to fill remaining space on current sheet first!
          activeTbl.tbody.removeChild(row);
          if (
            pageCtx.body.offsetHeight <= pageCtx.maxBodyHeight &&
            pageCtx.maxBodyHeight - pageCtx.body.offsetHeight >= MIN_REMAINING_SPLIT_PX
          ) {
            const splitCurr = splitOversizedRow(
              row,
              activeTbl.tbody,
              pageCtx.body,
              pageCtx.maxBodyHeight,
              false
            );
            if (splitCurr.placed) {
              if (splitCurr.leftover) {
                rowQueue.unshift(splitCurr.leftover);
                pageCtx = createBlankSheet();
                tblCtx = null;
              }
              continue;
            }
          }

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
          const splitFresh = splitOversizedRow(
            row,
            freshTbl.tbody,
            pageCtx.body,
            pageCtx.maxBodyHeight,
            true
          );
          if (splitFresh.leftover) {
            rowQueue.unshift(splitFresh.leftover);
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
        margin: 28.3pt 36.8pt 32.6pt 42.5pt;
        mso-header-margin: 28.3pt;
        mso-footer-margin: 28.3pt;
      }
      div.WordSection1 { page: WordSection1; }
      body {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 9.4pt;
        color: #000000;
        line-height: 1.46;
      }
      .kingdom-motto, .doc-title-block { text-align: center; }
      .muol-heading, .doc-main-title, .school-admin-block, .meta-muol, .sig-approval-muol, .sig-role-muol {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
      }
      .school-admin-block { font-size: 9.2pt; line-height: 1.6; }
      .doc-main-title { font-size: 10.6pt; }
      .doc-sub-title { font-style: italic; text-align: center; }
      .meta-section { margin-left: 68pt; margin-bottom: 7pt; }
      table.meta-table { width: 100%; border-collapse: collapse; border: none; table-layout: fixed; }
      table.meta-table td { border: none; padding: 1pt 0; vertical-align: top; font-family: "Khmer OS Siemreap", "Hanuman", serif; font-size: 9.4pt; }
      table.meta-table td.meta-label-cell { width: 136pt; font-weight: bold; white-space: nowrap; padding-right: 6pt; }
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
      table.lesson-table tr { page-break-inside: auto; }
      table.lesson-table th, table.lesson-table td {
        border: 1pt solid #000000;
        padding: 3.8pt 5.5pt;
        vertical-align: top;
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-size: 9.3pt;
      }
      table.lesson-table thead th {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
        font-size: 9.2pt;
        text-align: center;
        background: #F2F2F2;
      }
      .step-banner-cell {
        font-family: "Khmer OS Muol Light", "Moul", serif;
        font-weight: normal;
        font-size: 9.2pt;
        text-align: center;
        background: #F9F9F9;
        page-break-after: avoid;
      }
      .step-duration {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
        font-weight: bold;
      }
      .phase-5e-badge { font-weight: bold; text-decoration: underline; }
      .math-box { border: 0.75pt solid #222222; padding: 4pt 6pt; margin: 3pt 0; background: #FCFCFC; }
      .word-math-inline {
        font-family: "Cambria Math", "Times New Roman", serif;
        font-size: 9.8pt;
      }
      .word-math-display {
        font-family: "Cambria Math", "Times New Roman", serif;
        font-size: 10.2pt;
        text-align: center;
        margin: 4pt 0;
        font-weight: normal;
      }
      .word-mtext {
        font-family: "Khmer OS Siemreap", "Hanuman", serif;
      }
      table.layout-pair-table { width: 100%; border-collapse: collapse; border: none; margin: 2pt 0; }
      table.layout-pair-table > tbody > tr > td { border: none; padding: 1.5pt 4pt; vertical-align: top; width: 50%; }
      table.potence-table { border-collapse: collapse; border: none; margin: 3pt 0; }
      table.potence-table td { border: none; padding: 1pt 4pt; font-family: "Cambria Math", "Times New Roman", serif; font-size: 9.3pt; }
      table.potence-table td.pot-left { text-align: right; border-right: 1pt solid #000000; }
      table.potence-table td.pot-divisor { text-align: left; border-bottom: 1pt solid #000000; font-weight: bold; }
      table.potence-table td.pot-quotient { text-align: left; font-weight: bold; }
      .potence-sub { border-bottom: 0.75pt solid #000000; }
      .reflection-box { border: 1pt solid #000000; padding: 4.5pt 7pt; margin-top: 7pt; font-size: 9.3pt; }
      .signature-table { width: 100%; border: none; margin-top: 9pt; text-align: center; font-size: 9.2pt; }
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
