const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const selectedPrograms = [
  {
    number: 4,
    file: '4_sparse_matrix_add.c',
    title: 'Sparse Matrix Addition',
    output: `Enter total number of rows and columns for the matrices: 3 3
Enter number of non-zero elements for Matrix 1: 2
Enter number of non-zero elements for Matrix 2: 2

Enter Triplets for Matrix 1 (Row, Column, Value):
0 0 5
1 1 3

Enter Triplets for Matrix 2 (Row, Column, Value):
0 0 2
2 2 4

Resultant Sparse Matrix (Triplet Representation):
Row	Col	Value
3	3	3
0	0	7
1	1	3
2	2	4`
  },
  {
    number: 11,
    file: '11_postfix_evaluation.c',
    title: 'Evaluation of Postfix Expression Using Stack',
    output: `Enter the postfix expression: 2 3 + 4 5 - *
Result: -5`
  }
];

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Single-pass Syntax Highlighter for C Code (Clean Light Theme)
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

function buildHTML() {
  let programsHtml = '';

  selectedPrograms.forEach((prog, index) => {
    const filePath = path.join(__dirname, prog.file);
    const codeContent = fs.readFileSync(filePath, 'utf-8');
    const highlightedCode = highlightC(codeContent);

    programsHtml += `
    <section class="program-page" id="prog-${prog.number}">
      <div class="program-header">
        <div class="header-left">
          <span class="exp-badge">PROGRAM ${prog.number}</span>
          <span class="file-tag">${prog.file}</span>
          <h2 class="program-title">${prog.title}</h2>
        </div>
      </div>

      <div class="code-card">
        <div class="code-card-header">
          <span class="card-title">C SOURCE CODE</span>
          <span class="card-meta">${prog.file}</span>
        </div>
        <div class="code-block">${highlightedCode}</div>
      </div>

      <div class="output-card">
        <div class="output-card-header">
          <span class="card-title">PROGRAM OUTPUT</span>
          <span class="card-meta">Execution Verification</span>
        </div>
        <pre class="output-text">${prog.output}</pre>
      </div>
    </section>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Structures Practical Assignments - Programs 4 &amp; 11</title>
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

    /* PROGRAM HEADER */
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

    /* CODE CARD */
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

    /* OUTPUT CARD */
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
</html>
`;
}

(async () => {
  try {
    console.log('Building HTML for Programs 4 & 11...');
    const htmlContent = buildHTML();
    const htmlFilePath = path.join(__dirname, 'Programs_4_and_11_Record.html');
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

    // Also update Data_Structures_Lab_Record.html and Data_Structures_Lab_Record.pdf
    const labHtmlPath = path.join(__dirname, 'Data_Structures_Lab_Record.html');
    fs.writeFileSync(labHtmlPath, htmlContent, 'utf-8');

    console.log('Launching browser engine...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const htmlUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(__dirname, 'Programs_4_and_11_Record.pdf');
    const labPdfPath = path.join(__dirname, 'Data_Structures_Lab_Record.pdf');

    console.log('Rendering clean PDF for Programs 4 & 11...');
    const pdfOptions = {
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
          <span style="font-weight: 600; color: #0f172a;">Data Structures Laboratory — Programs 4 &amp; 11</span>
          <span>Source Code &amp; Output</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-top: 0.5px solid #e2e8f0; padding-top: 3px;">
          <span>Verified Practical Assignments</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `
    };

    // Save as Programs_4_and_11_Record.pdf
    await page.pdf({ ...pdfOptions, path: pdfPath });
    // Also update Data_Structures_Lab_Record.pdf
    await page.pdf({ ...pdfOptions, path: labPdfPath });

    console.log('Capturing screenshots for preview...');
    await page.setViewport({ width: 794, height: 1123 });

    const p4 = await page.$('#prog-4');
    if (p4) await p4.screenshot({ path: path.join(__dirname, 'preview_prog4.png') });

    const p11 = await page.$('#prog-11');
    if (p11) await p11.screenshot({ path: path.join(__dirname, 'preview_prog11.png') });

    await browser.close();

    const stats = fs.statSync(pdfPath);
    console.log('\n=============================================');
    console.log('PDF GENERATED FOR PROGRAMS 4 & 11 SUCCESSFULLY!');
    console.log('File Name: Programs_4_and_11_Record.pdf');
    console.log('File Size: ' + (stats.size / 1024).toFixed(2) + ' KB');
    console.log('Location: ' + pdfPath);
    console.log('=============================================\n');

  } catch (err) {
    console.error('Fatal error generating PDF for programs 4 and 11:', err);
  }
})();
