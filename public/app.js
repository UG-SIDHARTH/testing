// State Management
let programs = [];
let activeId = null;
let currentPdfBlob = null;
let currentPdfUrl = null;
let currentHtmlBlob = null;
let currentHtmlUrl = null;

// DOM Elements: Header
const btnLoadPresetsEl = document.getElementById('btnLoadPresets');
const lblUploadEl = document.getElementById('lblUpload');
const fileInputEl = document.getElementById('fileInput');
const btnRunAllEl = document.getElementById('btnRunAll');
const runCountBadgeEl = document.getElementById('runCountBadge');
const btnExportHtmlEl = document.getElementById('btnExportHtml');
const btnGeneratePdfEl = document.getElementById('btnGeneratePdf');

// DOM Elements: Left Sidebar
const progCountEl = document.getElementById('progCount');
const chkSelectAllEl = document.getElementById('chkSelectAll');
const selectedBadgeEl = document.getElementById('selectedBadge');
const btnQuickSelectAllEl = document.getElementById('btnQuickSelectAll');
const btnQuickSelect4and11El = document.getElementById('btnQuickSelect4and11');
const btnQuickSelectNoneEl = document.getElementById('btnQuickSelectNone');
const btnAddBlankEl = document.getElementById('btnAddBlank');
const dropzoneEl = document.getElementById('dropzone');
const programsListEl = document.getElementById('programsList');

// DOM Elements: Center Editor
const progTitleInputEl = document.getElementById('progTitleInput');
const progFileInputEl = document.getElementById('progFileInput');
const btnRunCurrentEl = document.getElementById('btnRunCurrent');
const codeEditorEl = document.getElementById('codeEditor');
const lineNumbersEl = document.getElementById('lineNumbers');
const codeStatsEl = document.getElementById('codeStats');
const codeSyncStatusEl = document.getElementById('codeSyncStatus');

// DOM Elements: Bottom Drawer (Stdin & Output)
const drawerTabBtns = document.querySelectorAll('.drawer-tab-btn');
const drawerPanes = document.querySelectorAll('.drawer-pane');
const drawerHintEl = document.getElementById('drawerHint');
const stdinEditorEl = document.getElementById('stdinEditor');
const outputEditorEl = document.getElementById('outputEditor');
const outputStatusDotEl = document.getElementById('outputStatusDot');
const btnRevertOutputEl = document.getElementById('btnRevertOutput');

// DOM Elements: Right Panel
const tabBtns = document.querySelectorAll('.output-tabs .tab-btn');
const tabContents = document.querySelectorAll('.output-panel .tab-content');
const terminalOutputEl = document.getElementById('terminalOutput');
const termStatusTitleEl = document.getElementById('termStatusTitle');
const termExecTimeEl = document.getElementById('termExecTime');

// Preview Tab
const pdfIframeEl = document.getElementById('pdfIframe');
const previewPlaceholderEl = document.getElementById('previewPlaceholder');
const pdfPageStatsEl = document.getElementById('pdfPageStats');
const btnOpenNewTabEl = document.getElementById('btnOpenNewTab');
const btnDownloadHtmlEl = document.getElementById('btnDownloadHtml');
const btnDownloadPdfEl = document.getElementById('btnDownloadPdf');
const btnTriggerPdfFromPlaceholder = document.getElementById('btnTriggerPdfFromPlaceholder');

// Settings Tab
const settingDocTitleEl = document.getElementById('settingDocTitle');
const settingSubtitleEl = document.getElementById('settingSubtitle');
const settingInstitutionEl = document.getElementById('settingInstitution');
const settingStudentNameEl = document.getElementById('settingStudentName');
const settingStudentRollEl = document.getElementById('settingStudentRoll');
const settingDateEl = document.getElementById('settingDate');

// Notifications & Modals
const toastContainerEl = document.getElementById('toastContainer');
const loadingOverlayEl = document.getElementById('loadingOverlay');
const loadingTitleEl = document.getElementById('loadingTitle');
const loadingDescEl = document.getElementById('loadingDesc');

// Helper: Unique ID
function createId() {
  return 'prog_' + Math.random().toString(36).substring(2, 9);
}

// 1. Toast Notifications
function showToast(type, message, duration = 3200) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '⚡';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'info') icon = 'ℹ';

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${escapeHtml(message)}</span>`;
  toastContainerEl.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// 2. Terminal Console Utilities
function clearTerminal() {
  terminalOutputEl.innerHTML = '';
}

function appendTerminal(type, text, isCmd = false) {
  const line = document.createElement('div');
  line.className = `term-line ${type}`;

  if (isCmd) {
    line.innerHTML = `<span class="usr">student@labrecord</span>:<span class="dir">~/c_practicals</span>$ <span class="cmd">${escapeHtml(text)}</span>`;
  } else {
    line.textContent = text;
  }

  terminalOutputEl.appendChild(line);
  terminalOutputEl.scrollTop = terminalOutputEl.scrollHeight;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 3. Line Numbers Sync & Editor Keybindings
function updateLineNumbers() {
  const lines = (codeEditorEl.value || '').split('\n').length;
  lineNumbersEl.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  codeStatsEl.textContent = `${lines} line${lines === 1 ? '' : 's'}`;
}

codeEditorEl.addEventListener('scroll', () => {
  lineNumbersEl.scrollTop = codeEditorEl.scrollTop;
});

codeEditorEl.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = codeEditorEl.selectionStart;
    const end = codeEditorEl.selectionEnd;
    codeEditorEl.value = codeEditorEl.value.substring(0, start) + '    ' + codeEditorEl.value.substring(end);
    codeEditorEl.selectionStart = codeEditorEl.selectionEnd = start + 4;
    updateActiveFromEditor();
    updateLineNumbers();
  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    runActiveProgram();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    updateActiveFromEditor();
    showToast('info', 'Code saved in workspace memory.');
  }
});

// 4. Update Selection Statistics
function updateSelectionCounts() {
  const total = programs.length;
  const selected = programs.filter(p => p.selected).length;

  selectedBadgeEl.textContent = `${selected} / ${total} Selected`;
  runCountBadgeEl.textContent = selected;

  if (total > 0 && selected === total) {
    chkSelectAllEl.checked = true;
    chkSelectAllEl.indeterminate = false;
  } else if (selected === 0) {
    chkSelectAllEl.checked = false;
    chkSelectAllEl.indeterminate = false;
  } else {
    chkSelectAllEl.checked = false;
    chkSelectAllEl.indeterminate = true;
  }
}

// 5. Render Programs in Sidebar
function renderProgramsList() {
  programsListEl.innerHTML = '';
  progCountEl.textContent = `${programs.length} File${programs.length === 1 ? '' : 's'}`;

  programs.forEach((prog, index) => {
    prog.number = index + 1;
    const item = document.createElement('div');
    item.className = `program-item ${prog.id === activeId ? 'active' : ''} ${prog.selected ? '' : 'unselected'}`;
    item.dataset.id = prog.id;

    let badgeClass = 'idle';
    let badgeText = 'IDLE';
    if (prog.status === 'compiling') {
      badgeClass = 'compiling';
      badgeText = 'RUNNING';
    } else if (prog.status === 'success') {
      badgeClass = 'success';
      badgeText = 'OK';
    } else if (prog.status === 'error') {
      badgeClass = 'error';
      badgeText = 'ERR';
    }

    item.innerHTML = `
      <div class="prog-item-left">
        <input type="checkbox" class="prog-checkbox" data-check="${prog.id}" ${prog.selected ? 'checked' : ''} title="Include in PDF & batch runs">
        <span class="prog-item-num">${String(prog.number).padStart(2, '0')}</span>
        <div class="prog-item-info">
          <div class="prog-item-title">${escapeHtml(prog.title || `Practical ${prog.number}`)}</div>
          <div class="prog-item-file">${escapeHtml(prog.file || `prog_${prog.number}.c`)}</div>
        </div>
      </div>
      <div class="prog-item-right">
        <button class="btn-move" data-move-up="${prog.id}" title="Move Up" ${index === 0 ? 'disabled' : ''}>▲</button>
        <button class="btn-move" data-move-down="${prog.id}" title="Move Down" ${index === programs.length - 1 ? 'disabled' : ''}>▼</button>
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        <button class="btn-del-prog" data-del="${prog.id}" title="Remove file">✕</button>
      </div>
    `;

    item.addEventListener('click', (e) => {
      // Checkbox click
      if (e.target.matches('.prog-checkbox')) {
        e.stopPropagation();
        prog.selected = e.target.checked;
        item.classList.toggle('unselected', !prog.selected);
        updateSelectionCounts();
        return;
      }

      // Delete click
      if (e.target.closest('.btn-del-prog')) {
        e.stopPropagation();
        deleteProgram(prog.id);
        return;
      }

      // Move Up click
      if (e.target.closest('[data-move-up]')) {
        e.stopPropagation();
        moveProgram(index, -1);
        return;
      }

      // Move Down click
      if (e.target.closest('[data-move-down]')) {
        e.stopPropagation();
        moveProgram(index, 1);
        return;
      }

      selectProgram(prog.id);
    });

    programsListEl.appendChild(item);
  });

  updateSelectionCounts();
}

// 6. Program Reordering
function moveProgram(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= programs.length) return;

  const item = programs.splice(index, 1)[0];
  programs.splice(newIndex, 0, item);
  renderProgramsList();
}

// 7. Select / Switch Active Program
function selectProgram(id) {
  activeId = id;
  const prog = programs.find(p => p.id === id);
  if (!prog) return;

  progTitleInputEl.value = prog.title || '';
  progFileInputEl.value = prog.file || '';
  codeEditorEl.value = prog.code || '';
  stdinEditorEl.value = prog.stdin || prog.defaultStdin || '';
  outputEditorEl.value = prog.output || prog.error || '';

  // Update output status dot
  if (prog.output) {
    outputStatusDotEl.style.background = '#10b981';
  } else if (prog.error) {
    outputStatusDotEl.style.background = '#f43f5e';
  } else {
    outputStatusDotEl.style.background = '#64748b';
  }

  codeSyncStatusEl.textContent = '● Saved';
  updateLineNumbers();
  renderProgramsList();

  // If this program has output, show it in the terminal
  if (prog.output || prog.error) {
    clearTerminal();
    appendTerminal('prompt', `gcc ${prog.file} -o prog && ./prog`, true);
    if (prog.error) {
      appendTerminal('error', prog.error);
    }
    if (prog.output) {
      appendTerminal('success', prog.output);
    }
  }
}

// 8. Update State from Inputs
function updateActiveFromEditor() {
  const prog = programs.find(p => p.id === activeId);
  if (!prog) return;

  prog.title = progTitleInputEl.value;
  prog.file = progFileInputEl.value;
  prog.code = codeEditorEl.value;
  prog.stdin = stdinEditorEl.value;
  prog.output = outputEditorEl.value;

  if (prog.output) {
    outputStatusDotEl.style.background = '#10b981';
  } else {
    outputStatusDotEl.style.background = '#64748b';
  }

  const activeListItem = document.querySelector(`.program-item[data-id="${activeId}"]`);
  if (activeListItem) {
    activeListItem.querySelector('.prog-item-title').textContent = prog.title || `Practical ${prog.number}`;
    activeListItem.querySelector('.prog-item-file').textContent = prog.file || `prog_${prog.number}.c`;
  }
}

progTitleInputEl.addEventListener('input', updateActiveFromEditor);
progFileInputEl.addEventListener('input', updateActiveFromEditor);
codeEditorEl.addEventListener('input', () => {
  codeSyncStatusEl.textContent = '● Editing...';
  updateActiveFromEditor();
  updateLineNumbers();
});
stdinEditorEl.addEventListener('input', updateActiveFromEditor);
outputEditorEl.addEventListener('input', () => {
  updateActiveFromEditor();
  const prog = programs.find(p => p.id === activeId);
  if (prog && prog.output) {
    prog.status = 'success';
    renderProgramsList();
  }
});

btnRevertOutputEl.addEventListener('click', () => {
  outputEditorEl.value = '';
  updateActiveFromEditor();
  const prog = programs.find(p => p.id === activeId);
  if (prog) {
    prog.output = '';
    prog.status = 'idle';
    renderProgramsList();
  }
  showToast('info', 'Program output cleared.');
});

// 9. Add Blank Program
function addBlankProgram() {
  const num = programs.length + 1;
  const newProg = {
    id: createId(),
    number: num,
    title: `Practical ${num}`,
    file: `program_${num}.c`,
    code: `#include <stdio.h>\n\nint main() {\n    printf("Execution successful.\\n");\n    return 0;\n}\n`,
    stdin: '',
    defaultStdin: '',
    output: '',
    status: 'idle',
    error: '',
    selected: true
  };

  programs.push(newProg);
  renderProgramsList();
  selectProgram(newProg.id);
  showToast('success', `Created Practical ${num}`);
}

btnAddBlankEl.addEventListener('click', addBlankProgram);

// 10. Delete Program
function deleteProgram(id) {
  const idx = programs.findIndex(p => p.id === id);
  if (idx === -1) return;

  const deleted = programs.splice(idx, 1)[0];
  showToast('info', `Removed ${deleted.file}`);

  if (activeId === id) {
    if (programs.length > 0) {
      selectProgram(programs[Math.max(0, idx - 1)].id);
    } else {
      activeId = null;
      progTitleInputEl.value = '';
      progFileInputEl.value = '';
      codeEditorEl.value = '';
      stdinEditorEl.value = '';
      outputEditorEl.value = '';
      updateLineNumbers();
      renderProgramsList();
    }
  } else {
    renderProgramsList();
  }
}

// 11. Selection Handlers
chkSelectAllEl.addEventListener('change', () => {
  const isChecked = chkSelectAllEl.checked;
  programs.forEach(p => { p.selected = isChecked; });
  renderProgramsList();
  showToast('info', isChecked ? 'Selected all practicals.' : 'Deselected all practicals.');
});

btnQuickSelectAllEl.addEventListener('click', () => {
  programs.forEach(p => { p.selected = true; });
  renderProgramsList();
  showToast('info', 'Selected all practicals.');
});

btnQuickSelectNoneEl.addEventListener('click', () => {
  programs.forEach(p => { p.selected = false; });
  renderProgramsList();
  showToast('info', 'Deselected all practicals.');
});

// Quick select Program 4 and 11
btnQuickSelect4and11El.addEventListener('click', () => {
  programs.forEach(p => {
    p.selected = (p.number === 4 || p.number === 11);
  });
  renderProgramsList();

  const selectedCount = programs.filter(p => p.selected).length;
  showToast('success', `Selected specifically Programs 4 & 11 (${selectedCount} files).`);
});

// 12. Compile & Run Single Program
async function compileAndRunProgram(prog) {
  prog.status = 'compiling';
  renderProgramsList();

  termStatusTitleEl.textContent = `Compiling & Executing ${prog.file}...`;
  clearTerminal();
  appendTerminal('prompt', `gcc ${prog.file} -o prog && ./prog`, true);

  try {
    const res = await fetch('/api/compile-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: prog.code,
        stdin: prog.stdin || prog.defaultStdin || ''
      })
    });

    const data = await res.json();

    if (!data.success) {
      prog.status = 'error';
      prog.error = data.error || 'Compilation or runtime failed.';
      prog.output = data.stdout || '';
      appendTerminal('error', `[ERROR]:\n${prog.error}`);
      termStatusTitleEl.textContent = `Error in ${prog.file}`;
    } else {
      prog.status = 'success';
      prog.error = '';
      prog.output = data.stdout || '(Program executed successfully with no stdout output)';
      appendTerminal('success', prog.output);
      termStatusTitleEl.textContent = `Finished ${prog.file} (${data.executionTimeMs}ms)`;
      termExecTimeEl.textContent = `${data.executionTimeMs}ms`;
    }

    if (prog.id === activeId) {
      outputEditorEl.value = prog.output || prog.error || '';
      if (prog.output) {
        outputStatusDotEl.style.background = '#10b981';
      } else {
        outputStatusDotEl.style.background = '#f43f5e';
      }
    }

  } catch (err) {
    prog.status = 'error';
    prog.error = err.message;
    appendTerminal('error', `[NETWORK/SERVER ERROR]: ${err.message}`);
    termStatusTitleEl.textContent = `Server Error`;
  }

  renderProgramsList();
}

async function runActiveProgram() {
  updateActiveFromEditor();
  const prog = programs.find(p => p.id === activeId);
  if (!prog) return;

  switchTab('tabTerminal');
  await compileAndRunProgram(prog);
}

btnRunCurrentEl.addEventListener('click', runActiveProgram);

// 13. Compile & Run Selected Programs
async function runSelectedPrograms() {
  const selected = programs.filter(p => p.selected);

  if (selected.length === 0) {
    showToast('error', 'Please select at least one program to run.');
    return;
  }

  updateActiveFromEditor();
  switchTab('tabTerminal');
  clearTerminal();
  appendTerminal('info', `=== Compiling & Running ${selected.length} Selected Programs ===`);

  btnRunAllEl.disabled = true;
  btnRunAllEl.innerHTML = '<span class="btn-icon">⏳</span><span>Running...</span>';

  let successCount = 0;

  for (let i = 0; i < selected.length; i++) {
    const prog = selected[i];
    appendTerminal('prompt', `[${i + 1}/${selected.length}] gcc ${prog.file} -o prog && ./prog`, true);
    await compileAndRunProgram(prog);
    if (prog.status === 'success') successCount++;
  }

  btnRunAllEl.disabled = false;
  btnRunAllEl.innerHTML = `<span class="btn-icon">▶</span><span>Run Selected (<span id="runCountBadge">${selected.length}</span>)</span>`;

  appendTerminal('info', `=== Complete: ${successCount}/${selected.length} programs ran successfully ===`);
  showToast('success', `Completed batch run: ${successCount}/${selected.length} successful.`);
}

btnRunAllEl.addEventListener('click', runSelectedPrograms);

// 14. Helper to Assemble Payload
function getExportPayload() {
  updateActiveFromEditor();

  const selected = programs.filter(p => p.selected);
  if (selected.length === 0) {
    return null;
  }

  return {
    docTitle: settingDocTitleEl.value.trim() || 'Data Structures & Algorithms Laboratory',
    subtitle: settingSubtitleEl.value.trim() || 'Source Code & Output Verification',
    institution: settingInstitutionEl.value.trim() || '',
    studentName: settingStudentNameEl.value.trim() || '',
    studentRoll: settingStudentRollEl.value.trim() || '',
    date: settingDateEl.value.trim() || '',
    programs: selected.map(p => ({
      number: p.number,
      title: p.title,
      file: p.file,
      code: p.code,
      output: p.output || p.error || '(No output recorded)'
    }))
  };
}

// 15. Generate PDF Record
async function generatePdfRecord() {
  const payload = getExportPayload();
  if (!payload) {
    showToast('error', 'Please select at least one program to include in the PDF.');
    return;
  }

  loadingOverlayEl.classList.remove('hidden');
  loadingTitleEl.textContent = 'Generating Academic PDF Record...';
  loadingDescEl.textContent = `Compiling formatting and high-resolution PDF for ${payload.programs.length} selected practicals...`;

  try {
    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to generate PDF');
    }

    const blob = await res.blob();
    currentPdfBlob = blob;

    if (currentPdfUrl) {
      URL.revokeObjectURL(currentPdfUrl);
    }
    currentPdfUrl = URL.createObjectURL(blob);

    // Display in iframe
    previewPlaceholderEl.classList.add('hidden');
    pdfIframeEl.classList.remove('hidden');
    pdfIframeEl.src = currentPdfUrl;

    pdfPageStatsEl.textContent = `Ready: ${payload.programs.length} Practicals Included | Pure White Print Theme`;

    // Switch to PDF Preview tab
    switchTab('tabPreview');
    showToast('success', `PDF Record generated successfully (${payload.programs.length} practicals)!`);

  } catch (err) {
    showToast('error', 'Error generating PDF: ' + err.message);
    alert('Error generating PDF: ' + err.message);
  } finally {
    loadingOverlayEl.classList.add('hidden');
  }
}

btnGeneratePdfEl.addEventListener('click', generatePdfRecord);
btnTriggerPdfFromPlaceholder.addEventListener('click', generatePdfRecord);

// Download PDF
btnDownloadPdfEl.addEventListener('click', () => {
  if (!currentPdfBlob || !currentPdfUrl) {
    generatePdfRecord();
    return;
  }
  const filename = programs.some(p => p.number === 4 && p.selected && programs.filter(x => x.selected).length <= 2)
    ? 'Programs_4_and_11_Record.pdf'
    : 'Data_Structures_Lab_Record.pdf';

  const a = document.createElement('a');
  a.href = currentPdfUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('success', `Downloaded ${filename}`);
});

// Open PDF in new tab
btnOpenNewTabEl.addEventListener('click', () => {
  if (currentPdfUrl) {
    window.open(currentPdfUrl, '_blank');
  } else {
    generatePdfRecord();
  }
});

// 16. Export HTML Record Directly
async function exportHtmlRecord() {
  const payload = getExportPayload();
  if (!payload) {
    showToast('error', 'Please select at least one program to export HTML.');
    return;
  }

  loadingOverlayEl.classList.remove('hidden');
  loadingTitleEl.textContent = 'Generating Standalone HTML...';
  loadingDescEl.textContent = `Synthesizing clean HTML report with syntax highlighting for ${payload.programs.length} practicals...`;

  try {
    const res = await fetch('/api/export-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to export HTML');
    }

    const htmlText = await res.text();
    const blob = new Blob([htmlText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Data_Structures_Lab_Record.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    showToast('success', 'Standalone HTML record downloaded.');

  } catch (err) {
    showToast('error', 'Error exporting HTML: ' + err.message);
  } finally {
    loadingOverlayEl.classList.add('hidden');
  }
}

btnExportHtmlEl.addEventListener('click', exportHtmlRecord);
btnDownloadHtmlEl.addEventListener('click', exportHtmlRecord);

// 17. Load 11 DS Lab Presets
async function loadPresets() {
  loadingOverlayEl.classList.remove('hidden');
  loadingTitleEl.textContent = 'Loading 11 DS Presets...';
  loadingDescEl.textContent = 'Fetching verified C code & inputs for Data Structures practicals...';

  try {
    const res = await fetch('/api/sample-programs');
    const data = await res.json();

    if (data.success && data.programs) {
      programs = data.programs.map((p, i) => ({
        id: createId(),
        number: p.number || (i + 1),
        title: p.title,
        file: p.file,
        code: p.code,
        stdin: p.defaultStdin,
        defaultStdin: p.defaultStdin,
        output: '',
        status: 'idle',
        error: '',
        selected: true
      }));

      renderProgramsList();
      if (programs.length > 0) {
        selectProgram(programs[0].id);
      }
      clearTerminal();
      appendTerminal('info', 'Loaded 11 Data Structures practical programs with default test inputs.');
      appendTerminal('info', 'Use checkboxes to pick specific experiments (or click "4 & 11" for Programs 4 & 11).');
      appendTerminal('info', 'Click "Run Selected" to compile with MinGW GCC.');

      showToast('success', 'Loaded 11 verified Data Structures C programs.');
    }
  } catch (err) {
    showToast('error', 'Failed to load presets: ' + err.message);
  } finally {
    loadingOverlayEl.classList.add('hidden');
  }
}

btnLoadPresetsEl.addEventListener('click', loadPresets);

// 18. File Upload (Dropzone & Input)
function handleFiles(files) {
  if (!files || files.length === 0) return;

  const fileArray = Array.from(files).filter(f => f.name.endsWith('.c') || f.name.endsWith('.h') || f.name.endsWith('.txt'));

  if (fileArray.length === 0) {
    showToast('error', 'Please select .c source files.');
    return;
  }

  let readCount = 0;
  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const code = e.target.result;
      const filename = file.name;
      let title = filename.replace(/\.c$/i, '').replace(/^[0-9]+[_\-\s]*/, '');
      title = title.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      if (!title) title = `Practical ${programs.length + 1}`;

      const newProg = {
        id: createId(),
        number: programs.length + 1,
        title,
        file: filename,
        code,
        stdin: '',
        defaultStdin: '',
        output: '',
        status: 'idle',
        error: '',
        selected: true
      };

      programs.push(newProg);
      readCount++;

      if (readCount === fileArray.length) {
        renderProgramsList();
        selectProgram(newProg.id);
        showToast('success', `Uploaded ${fileArray.length} source file${fileArray.length === 1 ? '' : 's'}.`);
      }
    };
    reader.readAsText(file);
  });
}

fileInputEl.addEventListener('change', (e) => {
  handleFiles(e.target.files);
  fileInputEl.value = '';
});

dropzoneEl.addEventListener('click', () => {
  fileInputEl.click();
});

dropzoneEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzoneEl.classList.add('dragover');
});

dropzoneEl.addEventListener('dragleave', () => {
  dropzoneEl.classList.remove('dragover');
});

dropzoneEl.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzoneEl.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

// 19. Drawer Tabs Switching (Stdin vs Output)
drawerTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.drawer;
    drawerTabBtns.forEach(b => b.classList.toggle('active', b === btn));
    drawerPanes.forEach(pane => pane.classList.toggle('active', pane.id === target));

    if (target === 'drawerStdin') {
      drawerHintEl.textContent = 'Optional: Provide interactive inputs for scanf() separated by spaces or newlines';
    } else {
      drawerHintEl.textContent = 'Edit or format the program output directly before PDF generation';
    }
  });
});

// 20. Output Panel Tabs (Terminal vs Preview vs Settings)
function switchTab(tabId) {
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadPresets();
});
