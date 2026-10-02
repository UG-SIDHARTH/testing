const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const selectedPrograms = [
  {
    number: 12,
    file: '12.c',
    title: 'Singly Linked List Operations',
    output: `- - - Linked List Menu - - -
1. Create
2. Display
3. Search
4. Insert at Beginning
5. Insert at Middle
6. Insert at End
7. Delete at Beginning
8. Delete at Middle
9. Delete at End
10. Exit
Enter choice : 1
Enter data : 10
Node created successfully

- - - Linked List Menu - - -
Enter choice : 4
Enter data : 5
Node inserted successfully at beginning

- - - Linked List Menu - - -
Enter choice : 6
Enter data : 30
Node inserted successfully at end

- - - Linked List Menu - - -
Enter choice : 5
Enter data : 20
Enter position : 3
Node inserted successfully at position 3

- - - Linked List Menu - - -
Enter choice : 2
Linked List: 5 -> 10 -> 20 -> 30 -> NULL

- - - Linked List Menu - - -
Enter choice : 3
Enter element to search : 20
Element 20 found at position 3

- - - Linked List Menu - - -
Enter choice : 8
Enter position to delete : 3
Deleted element: 20

- - - Linked List Menu - - -
Enter choice : 7
Deleted element: 5

- - - Linked List Menu - - -
Enter choice : 9
Deleted element: 30

- - - Linked List Menu - - -
Enter choice : 2
Linked List: 10 -> NULL

- - - Linked List Menu - - -
Enter choice : 10
Exiting...`
  },
  {
    number: 13,
    file: '13.c',
    title: 'Doubly Linked List Operations',
    output: `- - - Doubly Linked List Menu - - -
1. Create
2. Display
3. Search
4. Insert at Beginning
5. Insert at Middle
6. Insert at End
7. Delete at Beginning
8. Delete at Middle
9. Delete at End
10. Exit
Enter choice : 1
Enter data : 10
Node created successfully

- - - Doubly Linked List Menu - - -
Enter choice : 4
Enter data : 5
Node inserted successfully at beginning

- - - Doubly Linked List Menu - - -
Enter choice : 6
Enter data : 30
Node inserted successfully at end

- - - Doubly Linked List Menu - - -
Enter choice : 5
Enter data : 20
Enter position : 3
Node inserted successfully at position 3

- - - Doubly Linked List Menu - - -
Enter choice : 2
Linked List: 5 <-> 10 <-> 20 <-> 30 <-> NULL

- - - Doubly Linked List Menu - - -
Enter choice : 3
Enter element to search : 20
Element 20 found at position 3

- - - Doubly Linked List Menu - - -
Enter choice : 8
Enter position to delete : 3
Deleted element: 20

- - - Doubly Linked List Menu - - -
Enter choice : 7
Deleted element: 5

- - - Doubly Linked List Menu - - -
Enter choice : 9
Deleted element: 30

- - - Doubly Linked List Menu - - -
Enter choice : 2
Linked List: 10 <-> NULL

- - - Doubly Linked List Menu - - -
Enter choice : 10
Exiting...`
  },
  {
    number: 14,
    file: '14.c',
    title: 'Stack Operations Using Linked List',
    output: `1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 20
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
20
10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 2
Popped value: 20
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 4
Exiting...`
  },
  {
    number: 15,
    file: '15.c',
    title: 'Queue Operations Using Linked List',
    output: `1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 100
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 200
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
100
200
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 2
Dequeued value: 100
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
200
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 4
Exiting...`
  }
];

function escapeHtml(str) {
  return (str || '')
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

function buildHTML() {
  let programsHtml = '';
  selectedPrograms.forEach(prog => {
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
        <pre class="output-text">${escapeHtml(prog.output)}</pre>
      </div>
    </section>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Structures Lab Record - Programs 12 to 15</title>
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
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .exp-badge {
      display: inline-block;
      background: #0284c7;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 3px;
      margin-bottom: 4px;
    }
    .file-tag {
      font-family: Consolas, monospace;
      font-size: 7.5pt;
      color: #64748b;
      margin-left: 8px;
    }
    .program-title {
      font-size: 13pt;
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
    .c-comment { color: #64748b; font-style: italic; }
    .c-string { color: #166534; font-weight: 500; }
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
</html>
`;
}

(async () => {
  try {
    console.log('Generating HTML for Programs 12-15...');
    const htmlContent = buildHTML();
    const htmlFilePath = path.join(__dirname, 'Programs_12_to_15_Record.html');
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

    console.log('Launching browser engine...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const htmlUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

    const finalPdfPath = path.join(__dirname, 'Programs_12_to_15_Record.pdf');
    console.log('Rendering clean light-theme PDF for Programs 12 to 15...');
    await page.pdf({
      path: finalPdfPath,
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
          <span style="font-weight: 600; color: #0f172a;">Data Structures Laboratory — Linked Lists (Programs 12–15)</span>
          <span>Source Code &amp; Output</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-top: 0.5px solid #e2e8f0; padding-top: 3px;">
          <span>Practical Assignments</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `
    });

    await browser.close();

    const stats = fs.statSync(finalPdfPath);
    console.log('\n=============================================');
    console.log('PDF GENERATED SUCCESSFULLY!');
    console.log('File Name: Programs_12_to_15_Record.pdf');
    console.log('File Size: ' + (stats.size / 1024).toFixed(2) + ' KB');
    console.log('Location: ' + finalPdfPath);
    console.log('=============================================\n');

  } catch (err) {
    console.error('Fatal error generating PDF:', err);
  }
})();
