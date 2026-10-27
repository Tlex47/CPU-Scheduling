const processCountInput = document.getElementById('processCount');
const timeQuantumInput = document.getElementById('timeQuantum');
const btTableBody = document.getElementById('btTableBody');
const resultsContainer = document.getElementById('results');
const resultNavigation = document.getElementById('resultNavigation');
const resultTableTemplate = document.getElementById('resultTableTemplate');

// Set the default time quantum.
timeQuantumInput.value = '2';

function alertUser(message) {
  alert(message);
}

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

function getProcessCount() {
  const count = parsePositiveInt(processCountInput.value, 'จำนวน Processes');
  return count;
}

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
    burstTimes.push(bt);
  });

  return burstTimes;
}

function makeProcesses(burstTimes) {
  return burstTimes.map((bt, index) => ({
    name: `P${index + 1}`,
    at: 0,
    bt,
    originalOrder: index
  }));
}

function formatTwoDecimals(value) {
  return Number(value).toFixed(2);
}

// FCFS
function runFCFS(processes) {
  let currentTime = 0;
  const results = [];

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

    currentTime = completionTime;
  });

  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt };
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

    currentTime = completionTime;
  });

  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt };
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

  while (queue.length > 0) {
    const current = queue.shift();

    if (!firstStart.has(current.name)) {
      firstStart.set(current.name, currentTime);
    }

    const runTime = Math.min(current.remaining, quantum);
    current.remaining -= runTime;
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

  const avgWt = results.reduce((sum, item) => sum + item.wt, 0) / results.length;
  return { results, avgWt };
}

function createResultTable(title, resultData, cardId) {
  const card = resultTableTemplate.content.firstElementChild.cloneNode(true);
  card.id = cardId;
  card.querySelector('h3').textContent = title;
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

function showResult(resultId) {
  resultsContainer.querySelectorAll('.result-card').forEach((card) => {
    card.hidden = card.id !== resultId;
  });

  resultNavigation.querySelectorAll('button[data-target]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.target === resultId));
  });
}

function calculateAll() {
  try {
    const count = getProcessCount();
    const quantum = parsePositiveInt(timeQuantumInput.value, 'Time Quantum');
    const burstTimes = readBtValues();

    if (burstTimes.length !== count) {
      throw new Error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }

    const processes = makeProcesses(burstTimes);
    const fcfs = runFCFS(processes);
    const sjf = runSJF(processes);
    const rr = runRR(processes, quantum);

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(createResultTable('FCFS', fcfs, 'result-fcfs'));
    resultsContainer.appendChild(createResultTable('SJF ', sjf, 'result-sjf'));
    resultsContainer.appendChild(createResultTable('Round Robin ', rr, 'result-rr'));
    showResult('result-fcfs');

    resultNavigation.querySelectorAll('button[data-target]').forEach((button) => {
      button.disabled = false;
    });
  } catch (error) {
    alertUser(error.message || 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
  }
}

document.getElementById('createTableBtn').addEventListener('click', () => {
  try {
    createBtRows();
  } catch (error) {
    alertUser(error.message || 'จำนวน Processes ไม่ถูกต้อง');
  }
});

document.getElementById('randomizeBtn').addEventListener('click', () => {
  try {
    randomizeBt();
  } catch (error) {
    alertUser(error.message || 'ไม่สามารถสุ่มค่า Burst Time ได้');
  }
});

document.getElementById('calculateBtn').addEventListener('click', calculateAll);

document.getElementById('backToTopBtn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

resultNavigation.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-target]');
  if (!button) {
    return;
  }

  showResult(button.dataset.target);
});
