const processCountInput = document.getElementById('processCount');
const timeQuantumInput = document.getElementById('timeQuantum');
const btTableBody = document.getElementById('btTableBody');
const resultsContainer = document.getElementById('results');
const resultTableTemplate = document.getElementById('resultTableTemplate');
const resultsWindowNamePrefix = 'cpu-scheduling-results:';

// Set the default time quantum.
if (timeQuantumInput) {
  timeQuantumInput.value = '2';
}

function alertUser(message) {
  alert(message);
}

// ตรวจสอบและแปลงค่าที่รับมาให้เป็นจำนวนเต็มบวก
function parsePositiveInt(value, fieldName) {
  const trimmed = String(value).trim();
  if (trimmed === '') {
    throw new Error(`${fieldName} ต้องไม่เว้นว่าง`);
  }

  const num = Number(trimmed);
  if (!Number.isInteger(num) || num <= 0) {
    throw new Error(`${fieldName} ต้องเป็นจำนวนเต็มบวก`);
  }

  return num;
}

// อ่านจำนวนโปรเซสจากช่องกรอก
function getProcessCount() {
  const count = parsePositiveInt(processCountInput.value, 'จำนวน Processes');
  return count;
}

// สร้างแถวกรอก BT
function createBtRows() {
  const count = getProcessCount();
  btTableBody.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const row = document.createElement('tr');
    const processCell = document.createElement('td');
    const btCell = document.createElement('td');

    processCell.textContent = `P${i}`;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '99';
    input.step = '1';
    input.placeholder = 'BT';
    input.dataset.processIndex = String(i - 1);
    input.style.width = '100%';
    input.style.padding = '10px 12px';
    input.style.border = '1px solid #dfe7f5';
    input.style.borderRadius = '8px';

    btCell.appendChild(input);
    row.appendChild(processCell);
    row.appendChild(btCell);
    btTableBody.appendChild(row);
  }
}

// สุ่มค่า BT
function randomizeBt() {
  const count = getProcessCount();
  const rows = btTableBody.querySelectorAll('tr');

  if (rows.length === 0) {
    alertUser('กรุณาสร้างช่องกรอกข้อมูลก่อนสุ่มค่า BT');
    return;
  }

  if (rows.length !== count) {
    alertUser('จำนวนช่องกรอกข้อมูลไม่ตรงกับจำนวน Processes ที่ระบุ');
    return;
  }

  rows.forEach((row) => {
    const input = row.querySelector('input');
    if (!input) {
      return;
    }

    const randomBurst = Math.floor(Math.random() * 19) + 1;
    input.value = String(randomBurst);
  });
}

// เช็กค่า BT จากตารางที่กรอก
function readBtValues() {
  const count = getProcessCount();
  const rows = btTableBody.querySelectorAll('tr');

  if (rows.length === 0 || rows.length !== count) {
    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  const burstTimes = [];

  rows.forEach((row) => {
    const input = row.querySelector('input');
    if (!input) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    const value = input.value.trim();
    const bt = parsePositiveInt(value, 'Burst Time');
    if (bt > 99) {
      throw new Error('Burst Time ต้องอยู่ระหว่าง 1 ถึง 99');
    }

    burstTimes.push(bt);
  });

  return burstTimes;
}

// สร้างข้อมูลจาก BT
function makeProcesses(burstTimes) {
  return burstTimes.map((bt, index) => ({
    name: `P${index + 1}`,
    at: 0,
    bt,
    originalOrder: index
  }));
}

// จัดทศนิยมสองตำแหน่ง
function formatTwoDecimals(value) {
  return Number(value).toFixed(2);
}

// FCFS
function runFCFS(processes) {
  let currentTime = 0;
  const results = [];
  const gantt = [];

  processes.forEach((process) => {
    const startTime = currentTime;
    const completionTime = currentTime + process.bt;
    const tat = completionTime - process.at;
    const wt = tat - process.bt;

    results.push({
      process: process.name,
      at: process.at,
      bt: process.bt,
      st: startTime,
      ct: completionTime,
      tat,
      wt
    });

    gantt.push({ process: process.name, start: startTime, end: completionTime });
    currentTime = completionTime;
  });

  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt, gantt };
}

// SJF
function runSJF(processes) {
  const ordered = [...processes].sort((a, b) => {
    if (a.bt !== b.bt) {
      return a.bt - b.bt;
    }
    return a.originalOrder - b.originalOrder;
  });

  let currentTime = 0;
  const results = [];
  const gantt = [];

  ordered.forEach((process) => {
    const startTime = currentTime;
    const completionTime = currentTime + process.bt;
    const tat = completionTime - process.at;
    const wt = tat - process.bt;

    results.push({
      process: process.name,
      at: process.at,
      bt: process.bt,
      st: startTime,
      ct: completionTime,
      tat,
      wt
    });

    gantt.push({ process: process.name, start: startTime, end: completionTime });
    currentTime = completionTime;
  });

  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt, gantt };
}

// RR
function runRR(processes, quantum) {
  const queue = processes.map((process) => ({
    ...process,
    remaining: process.bt
  }));

  let currentTime = 0;
  const firstStart = new Map();
  const results = [];
  const gantt = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!firstStart.has(current.name)) {
      firstStart.set(current.name, currentTime);
    }

    const runTime = Math.min(current.remaining, quantum);
    current.remaining -= runTime;
    gantt.push({
      process: current.name,
      start: currentTime,
      end: currentTime + runTime
    });
    currentTime += runTime;

    if (current.remaining === 0) {
      const completionTime = currentTime;
      const tat = completionTime - current.at;
      const wt = tat - current.bt;

      results.push({
        process: current.name,
        at: current.at,
        bt: current.bt,
        st: firstStart.get(current.name),
        ct: completionTime,
        tat,
        wt
      });
    } else {
      queue.push(current);
    }
  }

  results.sort((a, b) => Number(a.process.slice(1)) - Number(b.process.slice(1)));
  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt, gantt };
}

function createGanttChart(gantt, container) {
  const track = container.querySelector('.gantt-track');
  const timeline = container.querySelector('.gantt-timeline');
  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;

  track.style.width = '100%';
  timeline.style.width = '100%';

  gantt.forEach((entry, index) => {
    const duration = entry.end - entry.start;
    const processIndex = Number(entry.process.slice(1)) - 1;
    const segment = document.createElement('div');
    segment.className = 'gantt-segment';
    segment.setAttribute('role', 'listitem');
    segment.style.flex = `${duration} 1 0px`;
    segment.style.setProperty('--process-index', String(processIndex));
    segment.textContent = entry.process;
    segment.setAttribute('aria-label', `${entry.process}: ${entry.start} to ${entry.end}`);
    track.appendChild(segment);

    const timeLabel = document.createElement('span');
    timeLabel.className = 'gantt-time';
    timeLabel.textContent = String(entry.start);
    timeLabel.style.left = `${(entry.start / totalTime) * 100}%`;
    if (index === 0) {
      timeLabel.classList.add('gantt-time-start');
    }
    timeline.appendChild(timeLabel);
  });

  if (totalTime > 0) {
    const endLabel = document.createElement('span');
    endLabel.className = 'gantt-time gantt-time-end';
    endLabel.textContent = String(totalTime);
    timeline.appendChild(endLabel);
  }
}

// สร้างตารางผลลัพธ์ของอัลกอริทึม
function createResultTable(title, resultData, cardId) {
  const card = resultTableTemplate.content.firstElementChild.cloneNode(true);
  card.id = cardId;
  card.querySelector('h3').textContent = title;
  createGanttChart(resultData.gantt, card.querySelector('.gantt-scroll'));
  const tbody = card.querySelector('tbody');

  resultData.results.forEach((row) => {
    const cells = [row.process, row.at, row.bt, row.st, row.ct, row.tat, row.wt];
    const tableRow = tbody.insertRow();
    cells.forEach((value) => {
      tableRow.insertCell().textContent = String(value);
    });
  });

  card.querySelector('.average-value').textContent = formatTwoDecimals(resultData.avgWt);

  return card;
}

function createComparisonSummary(algorithmResults) {
  const lowestAvgWt = Math.min(...algorithmResults.map(({ result }) => result.avgWt));
  const bestAlgorithms = algorithmResults
    .filter(({ result }) => Math.abs(result.avgWt - lowestAvgWt) < 1e-9)
    .map(({ name }) => name);
  const summary = document.createElement('section');
  summary.className = 'comparison-summary';
  summary.setAttribute('aria-label', 'Algorithm comparison');

  const heading = document.createElement('h3');
  heading.textContent = 'เปรียบเทียบผลลัพธ์';

  const description = document.createElement('p');
  description.textContent =
    `AVG WT ต่ำที่สุด: ${bestAlgorithms.join(', ')} (${formatTwoDecimals(lowestAvgWt)})`;

  summary.append(heading, description);
  return summary;
}

// ตรวจสอบข้อมูลและส่งไปหน้าผลลัพธ์ในแท็บใหม่
function calculateAll(event) {
  event.preventDefault();

  try {
    const count = getProcessCount();
    const quantum = parsePositiveInt(timeQuantumInput.value, 'Time Quantum');
    const burstTimes = readBtValues();

    if (burstTimes.length !== count) {
      throw new Error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }

    const resultData = JSON.stringify({
      count,
      quantum,
      burstTimes
    });
    const resultsWindow = window.open('about:blank', '_blank');
    if (!resultsWindow) {
      throw new Error('เบราว์เซอร์บล็อกการเปิดแท็บใหม่ กรุณาอนุญาต Pop-up แล้วลองอีกครั้ง');
    }

    resultsWindow.name = `${resultsWindowNamePrefix}${resultData}`;
    resultsWindow.location.replace(new URL('results.html', window.location.href).href);
  } catch (error) {
    alertUser(error.message || 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
  }
}

function renderResultsPage() {
  try {
    const windowName = window.name;
    window.name = '';
    if (!windowName.startsWith(resultsWindowNamePrefix)) {
      throw new Error('ไม่พบข้อมูลที่ส่งมา กรุณากลับไปกรอกข้อมูลและกด Calculate อีกครั้ง');
    }

    const data = JSON.parse(windowName.slice(resultsWindowNamePrefix.length));
    if (!data || typeof data !== 'object') {
      throw new Error('ข้อมูลผลลัพธ์ไม่ถูกต้อง');
    }

    const count = parsePositiveInt(data.count, 'จำนวน Processes');
    const quantum = parsePositiveInt(data.quantum, 'Time Quantum');
    if (!Array.isArray(data.burstTimes)) {
      throw new Error('ข้อมูล Burst Time ไม่ถูกต้อง');
    }

    const burstTimes = data.burstTimes.map((value) => {
      const bt = parsePositiveInt(value, 'Burst Time');
      if (bt > 99) {
        throw new Error('Burst Time ต้องอยู่ระหว่าง 1 ถึง 99');
      }
      return bt;
    });

    if (burstTimes.length !== count) {
      throw new Error('จำนวน Burst Time ไม่ตรงกับจำนวน Processes');
    }

    const processes = makeProcesses(burstTimes);
    const fcfs = runFCFS(processes);
    const sjf = runSJF(processes);
    const rr = runRR(processes, quantum);
    const algorithmResults = [
      { name: 'FCFS', result: fcfs },
      { name: 'SJF', result: sjf },
      { name: 'RR', result: rr }
    ];

    const inputSummary = document.getElementById('inputSummary');
    inputSummary.textContent =
      `จำนวน Processes: ${count} | Time Quantum: ${quantum} | Burst Time: ${burstTimes.join(', ')}`;
    resultsContainer.appendChild(createComparisonSummary(algorithmResults));
    resultsContainer.appendChild(createResultTable('FCFS', fcfs, 'result-fcfs'));
    resultsContainer.appendChild(createResultTable('SJF ', sjf, 'result-sjf'));
    resultsContainer.appendChild(createResultTable('Round Robin ', rr, 'result-rr'));
  } catch (error) {
    resultsContainer.textContent = error.message || 'ไม่สามารถแสดงผลลัพธ์ได้';
  }
}

// เช็กการกดปุ่มสร้างตารางกรอก BT
const createTableButton = document.getElementById('createTableBtn');
if (createTableButton) {
  createTableButton.addEventListener('click', () => {
    try {
      createBtRows();
    } catch (error) {
      alertUser(error.message || 'จำนวน Processes ไม่ถูกต้อง');
    }
  });
}

// จัดการการคลิกปุ่มสุ่มค่า BT
const randomizeButton = document.getElementById('randomizeBtn');
if (randomizeButton) {
  randomizeButton.addEventListener('click', () => {
    try {
      randomizeBt();
    } catch (error) {
      alertUser(error.message || 'ไม่สามารถสุ่มค่า Burst Time ได้');
    }
  });
}

// ตรวจสอบข้อมูลก่อนส่งฟอร์มผลลัพธ์ไปยังแท็บใหม่
const inputForm = document.getElementById('inputForm');
if (inputForm) {
  inputForm.addEventListener('submit', calculateAll);
}

if (resultsContainer) {
  renderResultsPage();

  document.getElementById('returnToInputBtn').addEventListener('click', () => {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
    }

    window.close();
    window.setTimeout(() => {
      if (!window.closed) {
        window.location.replace('index.html');
      }
    }, 100);
  });
}
