document.getElementById('csvFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    // Força a leitura como Latin-1 (ISO-8859-1), compatível com Excel/Windows
    reader.readAsText(file, 'ISO-8859-1');
  
    reader.onload = function (e) {
      const content = e.target.result;
      const data = parseCSV(content);
      if (data && data.length > 1) {
        displayTable(data);
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
  
    return lines.map(line => {
      return line.split(';').map(cell =>
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
        if (index === 8) {
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
  
    enableSearch(data);
  }
  
  function enableSearch(data) {
    const searchInput = document.getElementById('searchInput');
    const originalData = data.slice(1);
  
    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const filtered = originalData.filter(row =>
        row.some(cell => cell.toLowerCase().includes(query))
      );
      displayTable([data[0], ...filtered]);
    });
  }
  