const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const crypto = require('crypto');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = process.env.PORT || 8082;

// Setup temp directory
const TEMP_DIR = path.join(__dirname, 'temp_build');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Multer storage for uploads
const upload = multer({ dest: TEMP_DIR });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 1. Single-pass C Syntax Highlighter (Clean Light Theme)
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightC(code) {
  const tokenRegex = /(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])+')|(^[ \t]*#[ \t]*\w+[^\r\n]*)|(\b(?:return|if|else|while|for|switch|case|break|continue|default|do|sizeof|goto)\b)|(\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|typedef|size_t|const)\b)|(\b(?:NULL|MAX|stdin|stdout)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*(?=\s*\())/gm;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }

    const [full, comment, str, preproc, keyword, type, constant, number, func] = match;

    if (comment) {
      result += `<span class="c-comment">${escapeHtml(comment)}</span>`;
    } else if (str) {
      result += `<span class="c-string">${escapeHtml(str)}</span>`;
    } else if (preproc) {
      const pMatch = preproc.match(/^([ \t]*#[ \t]*\w+)([\s\S]*)$/);
      if (pMatch) {
        result += `<span class="c-preprocessor">${escapeHtml(pMatch[1])}</span><span class="c-include">${escapeHtml(pMatch[2])}</span>`;
      } else {
        result += `<span class="c-preprocessor">${escapeHtml(preproc)}</span>`;
      }
    } else if (keyword) {
      result += `<span class="c-keyword">${escapeHtml(keyword)}</span>`;
    } else if (type) {
      result += `<span class="c-type">${escapeHtml(type)}</span>`;
    } else if (constant) {
      result += `<span class="c-constant">${escapeHtml(constant)}</span>`;
    } else if (number) {
      result += `<span class="c-number">${escapeHtml(number)}</span>`;
    } else if (func) {
      result += `<span class="c-function">${escapeHtml(func)}</span>`;
    } else {
      result += escapeHtml(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  const lines = result.split('\n');
  return lines.map((line, idx) => {
    const lineNum = String(idx + 1).padStart(2, ' ');
    return `<div class="line-row"><span class="line-num">${lineNum}</span><span class="line-code">${line || '&nbsp;'}</span></div>`;
  }).join('');
}

// 2. Helper to Compile & Execute C Code with Stdin
function compileAndRun(code, stdin = '', timeoutMs = 5000) {
  return new Promise((resolve) => {
    const jobId = crypto.randomBytes(6).toString('hex');
    const cPath = path.join(TEMP_DIR, `job_${jobId}.c`);
    const exePath = path.join(TEMP_DIR, `job_${jobId}.exe`);

    fs.writeFileSync(cPath, code, 'utf-8');

    const startTime = Date.now();

    // Compile using MinGW GCC
    exec(`gcc -Wall "${cPath}" -o "${exePath}"`, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        // Clean up .c file
        try { fs.unlinkSync(cPath); } catch (_) {}
        return resolve({
          success: false,
          stage: 'compilation',
          error: compileStderr || compileErr.message,
          executionTimeMs: Date.now() - startTime
        });
      }

      // Execute compiled executable
      let stdout = '';
      let stderr = '';
      let killed = false;

      const proc = spawn(exePath);

      const timer = setTimeout(() => {
        killed = true;
        proc.kill('SIGKILL');
      }, timeoutMs);

      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });

      proc.on('close', (code) => {
        clearTimeout(timer);
        const execDuration = Date.now() - startTime;

        // Clean up binaries
        try { fs.unlinkSync(cPath); } catch (_) {}
        try { if (fs.existsSync(exePath)) fs.unlinkSync(exePath); } catch (_) {}

        if (killed) {
          return resolve({
            success: false,
            stage: 'execution_timeout',
            error: `Execution timed out (${timeoutMs / 1000}s limit). If your program uses scanf(), please provide standard input in the Input box.`,
            stdout,
            executionTimeMs: execDuration
          });
        }

        resolve({
          success: code === 0,
          stage: 'complete',
          exitCode: code,
          stdout,
          stderr,
          executionTimeMs: execDuration
        });
      });

      // Send standard input
      if (stdin) {
        proc.stdin.write(stdin);
      }
      proc.stdin.end();
    });
  });
}

// 3. HTML Builder for PDF & HTML Export
function buildRecordHtml({ 
  docTitle = 'Data Structures Laboratory', 
  subtitle = 'Source Code & Output Verification', 
  institution = '',
  studentName = '',
  studentRoll = '',
  date = '',
  programs = [] 
}) {
  let programsHtml = '';

  programs.forEach((prog, index) => {
    const progNum = prog.number || (index + 1);
    const highlightedCode = highlightC(prog.code || '');
    const title = prog.title || `Practical ${progNum}`;
    const filename = prog.file || `program_${progNum}.c`;
    const output = (prog.output || '').trim();

    let studentMetaHtml = '';
    if (studentName || studentRoll) {
      studentMetaHtml = `<span class="student-meta">${escapeHtml(studentName)}${studentRoll ? ` &bull; Roll: ${escapeHtml(studentRoll)}` : ''}</span>`;
    }

    programsHtml += `
    <section class="program-page" id="prog-${progNum}">
      <div class="program-header">
        <div class="header-left">
          <span class="exp-badge">PROGRAM ${progNum}</span>
          <span class="file-tag">${escapeHtml(filename)}</span>
          <h2 class="program-title">${escapeHtml(title)}</h2>
        </div>
        ${studentMetaHtml ? `<div class="header-right">${studentMetaHtml}</div>` : ''}
      </div>

      <div class="code-card">
        <div class="code-card-header">
          <span class="card-title">C SOURCE CODE</span>
          <span class="card-meta">${escapeHtml(filename)}</span>
        </div>
        <div class="code-block">${highlightedCode}</div>
      </div>

      <div class="output-card">
        <div class="output-card-header">
          <span class="card-title">PROGRAM OUTPUT</span>
          <span class="card-meta">Execution Verification</span>
        </div>
        <pre class="output-text">${escapeHtml(output || 'No output recorded.')}</pre>
      </div>
    </section>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(docTitle)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 9pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .program-page {
      page-break-after: always;
      break-after: page;
      padding-bottom: 6px;
    }
    .program-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    .program-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
    .student-meta {
      font-size: 8.5pt;
      font-weight: 600;
      color: #0369a1;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .exp-badge {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 8pt;
      letter-spacing: 0.8px;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .file-tag {
      background: #f1f5f9;
      color: #0369a1;
      font-weight: 600;
      font-size: 8.5pt;
      padding: 2px 7px;
      border-radius: 4px;
      font-family: Consolas, "Cascadia Code", monospace;
      border: 1px solid #cbd5e1;
    }
    .program-title {
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
    }
    .code-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .code-card-header, .output-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 5px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      font-size: 8pt;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.6px;
    }
    .card-meta {
      font-size: 7.5pt;
      color: #64748b;
      font-family: Consolas, monospace;
    }
    .code-block {
      padding: 6px 10px;
      font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
      font-size: 8pt;
      line-height: 1.36;
      color: #0f172a;
      background: #ffffff;
    }
    .line-row {
      display: flex;
    }
    .line-num {
      width: 26px;
      color: #94a3b8;
      user-select: none;
      text-align: right;
      margin-right: 10px;
      flex-shrink: 0;
      font-size: 7.5pt;
      border-right: 1px solid #e2e8f0;
      padding-right: 6px;
    }
    .line-code {
      flex-grow: 1;
      white-space: pre-wrap;
      word-break: break-all;
    }
    /* SYNTAX HIGHLIGHTING (Light / Print Theme) */
    .c-comment { color: #64748b; font-style: italic; }
    .c-string { color: #166534; font-weight: 500; }
    .c-char { color: #15803d; }
    .c-preprocessor { color: #7c3aed; font-weight: 600; }
    .c-include { color: #475569; font-weight: 500; }
    .c-keyword { color: #0369a1; font-weight: 700; }
    .c-type { color: #b45309; font-weight: 700; }
    .c-constant { color: #6b21a8; font-weight: 700; }
    .c-number { color: #c2410c; }
    .c-function { color: #1d4ed8; font-weight: 600; }

    .output-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      page-break-inside: auto;
    }
    .output-card-header {
      background: #f1f5f9;
    }
    .output-text {
      padding: 8px 12px;
      font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
      font-size: 8pt;
      line-height: 1.38;
      color: #0f172a;
      background: #f8fafc;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>
  ${programsHtml}
</body>
</html>`;
}

// 4. API Endpoints

// GET /api/sample-programs
app.get('/api/sample-programs', (req, res) => {
  const sampleMeta = [
    { number: 1, file: '1_matrix_add.c', title: 'Matrix Addition', defaultStdin: '2 2\n1 2 3 4\n5 6 7 8\n' },
    { number: 2, file: '2_polynomial_add.c', title: 'Addition of Two Polynomials Using Structures', defaultStdin: '2\n2\n4 2\n3 1\n5 2\n2 0\n' },
    { number: 3, file: '3_matrix_to_sparse.c', title: 'Tuple Representation of Sparse Matrix', defaultStdin: '3 3\n0 0 5 0 8 0 0 0 0\n' },
    { number: 4, file: '4_sparse_matrix_add.c', title: 'Sparse Matrix Addition', defaultStdin: '3 3\n2\n2\n0 0 5\n1 1 3\n0 0 2\n2 2 4\n' },
    { number: 5, file: '5_sparse_trans.c', title: 'Transpose of Sparse Matrix', defaultStdin: '3 3\n3\n0 1 5\n1 2 8\n2 0 3\n' },
    { number: 6, file: '6_stack.c', title: 'Stack Operations Using Array', defaultStdin: '1\n10\n1\n20\n3\n2\n3\n4\n' },
    { number: 7, file: '7_standard_queue.c', title: 'Linear Queue Operations Using Array', defaultStdin: '1\n100\n1\n200\n3\n2\n3\n4\n' },
    { number: 8, file: '8_circular_queue.c', title: 'Circular Queue Operations Using Array', defaultStdin: '1\n10\n1\n20\n1\n30\n3\n2\n1\n40\n3\n4\n' },
    { number: 9, file: '9_dequeue.c', title: 'Double Ended Queue (Deque) Operations', defaultStdin: '2\n10\n2\n20\n1\n5\n5\n3\n5\n6\n' },
    { number: 10, file: '10_infixtopostfix.c', title: 'Infix to Postfix Expression Conversion', defaultStdin: '(2+3)*(4-5)\n' },
    { number: 11, file: '11_postfix_evaluation.c', title: 'Evaluation of Postfix Expression Using Stack', defaultStdin: '2 3 + 4 5 - *\n' }
  ];

  const results = sampleMeta.map(m => {
    let code = '';
    const filePath = path.join(__dirname, m.file);
    if (fs.existsSync(filePath)) {
      code = fs.readFileSync(filePath, 'utf-8');
    }
    return {
      ...m,
      code,
      output: '',
      status: 'idle'
    };
  });

  res.json({ success: true, count: results.length, programs: results });
});

// POST /api/upload-files
app.post('/api/upload-files', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    const uploaded = req.files.map((f, idx) => {
      const code = fs.readFileSync(f.path, 'utf-8');
      const filename = f.originalname || `upload_${idx + 1}.c`;
      // Clean name for title
      let title = filename.replace(/\.c$/i, '').replace(/^[0-9]+[_\-\s]*/, '');
      title = title.replace(/[_\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      if (!title) title = `Experiment ${idx + 1}`;

      // Clean temp file
      try { fs.unlinkSync(f.path); } catch (_) {}

      return {
        number: idx + 1,
        file: filename,
        title,
        code,
        defaultStdin: '',
        output: '',
        status: 'idle'
      };
    });

    res.json({ success: true, count: uploaded.length, programs: uploaded });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/compile-run
app.post('/api/compile-run', async (req, res) => {
  const { code, stdin = '' } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'No C code provided.' });
  }

  try {
    const result = await compileAndRun(code, stdin);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/export-html
app.post('/api/export-html', (req, res) => {
  const { 
    docTitle = 'Data Structures Laboratory', 
    subtitle = 'Source Code & Output Verification',
    institution = '',
    studentName = '',
    studentRoll = '',
    date = '',
    programs = [] 
  } = req.body;

  if (!programs || programs.length === 0) {
    return res.status(400).json({ success: false, error: 'No programs provided for HTML export.' });
  }

  try {
    const htmlContent = buildRecordHtml({ 
      docTitle, 
      subtitle, 
      institution, 
      studentName, 
      studentRoll, 
      date, 
      programs 
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Data_Structures_Lab_Record.html"');
    res.send(htmlContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/generate-pdf
app.post('/api/generate-pdf', async (req, res) => {
  const { 
    docTitle = 'Data Structures Laboratory', 
    subtitle = 'Source Code & Output Verification',
    institution = '',
    studentName = '',
    studentRoll = '',
    date = '',
    programs = [] 
  } = req.body;

  if (!programs || programs.length === 0) {
    return res.status(400).json({ success: false, error: 'No programs provided for PDF generation.' });
  }

  let browser;
  try {
    const htmlContent = buildRecordHtml({ 
      docTitle, 
      subtitle, 
      institution, 
      studentName, 
      studentRoll, 
      date, 
      programs 
    });
    const tempHtmlPath = path.join(TEMP_DIR, `render_${Date.now()}.html`);
    fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 
      (process.platform === 'win32'
        ? (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') 
            ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' 
            : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
        : '/usr/bin/chromium');

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    const htmlUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

    let runningHeaderLeft = docTitle;
    if (institution) runningHeaderLeft += ` — ${institution}`;

    let runningFooterLeft = 'Practical Assignments Record';
    if (studentName) {
      runningFooterLeft = `${studentName}${studentRoll ? ` (${studentRoll})` : ''}`;
    }
    if (date) {
      runningFooterLeft += ` &bull; ${date}`;
    }

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        bottom: '14mm',
        left: '14mm',
        right: '14mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-bottom: 0.5px solid #e2e8f0; padding-bottom: 3px;">
          <span style="font-weight: 600; color: #0f172a;">${escapeHtml(runningHeaderLeft)}</span>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-top: 0.5px solid #e2e8f0; padding-top: 3px;">
          <span>${runningFooterLeft}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `
    });

    await browser.close();
    browser = null;

    try { fs.unlinkSync(tempHtmlPath); } catch (_) {}

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Data_Structures_Lab_Record.pdf"');
    res.send(pdfBuffer);

  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    console.error('PDF Generation Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 LabRecord Studio Server running at http://localhost:${PORT}`);
  console.log(`===================================================`);
});
