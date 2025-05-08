document.getElementById('csvFile').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  // Usar UTF-8 como padrão, pois é mais comum e evita problemas de leitura
  reader.readAsText(file);

  reader.onload = function (e) {
    const content = e.target.result;
    const data = parseCSV(content);

    if (data && data.length > 1) {
      displayTable(data);
      enableSearch(data); // garantir que a busca seja ativada após a leitura
    } else {
      alert('O arquivo CSV parece estar vazio ou mal formatado.');
    }
  };

  reader.onerror = function () {
    alert('Erro ao ler o arquivo CSV.');
  };
});

function parseCSV(csv) {
  const lines = csv.trim().split('\n');

  // Detecta automaticamente o separador (ponto e vírgula ou vírgula)
  const separator = lines[0].includes(';') ? ';' : ',';

  return lines.map(line => {
    return line.split(separator).map(cell =>
      cell.trim().replace('#REF!', '').replace(/\s+/g, ' ')
    );
  });
}

function displayTable(data) {
  const tbody = document.querySelector('#csvTable tbody');
  tbody.innerHTML = '';

  data.slice(1).forEach(row => {
    const tr = document.createElement('tr');

    row.forEach((cell, index) => {
      const td = document.createElement('td');
      if (index === 8 && cell.startsWith('http')) {
        const a = document.createElement('a');
        a.href = cell;
        a.target = '_blank';
        a.textContent = '🔗 Acessar';
        td.appendChild(a);
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function enableSearch(data) {
  const searchInput = document.getElementById('searchInput');
  const originalData = data.slice(1);

  let searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const query = this.value.toLowerCase();

      const filtered = originalData.filter(row =>
        row.some(cell => cell.toLowerCase().includes(query))
      );

      displayTable([data[0], ...filtered]);
    }, 300);
  });
}
