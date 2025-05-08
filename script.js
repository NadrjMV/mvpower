<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Leitor de CSV</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    input[type="file"], input[type="text"] { margin-bottom: 10px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>

  <h2>Importar CSV</h2>
  <input type="file" id="csvFile" accept=".csv" />
  <br />
  <input type="text" id="searchInput" placeholder="Pesquisar..." />

  <table id="csvTable">
    <thead></thead>
    <tbody></tbody>
  </table>

  <script>
    document.getElementById('csvFile').addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file); // Usando UTF-8 padrão

      reader.onload = function (e) {
        const content = e.target.result;
        const data = parseCSV(content);
        if (data && data.length > 1) {
          displayTable(data);
          enableSearch(data);
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
      const separator = lines[0].includes(';') ? ';' : ',';

      return lines.map(line => {
        return line.split(separator).map(cell =>
          cell.trim().replace('#REF!', '').replace(/\s+/g, ' ')
        );
      });
    }

    function displayTable(data) {
      const table = document.getElementById('csvTable');
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');

      // Cabeçalho
      thead.innerHTML = '';
      const headerRow = document.createElement('tr');
      data[0].forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Corpo da tabela
      tbody.innerHTML = '';
      data.slice(1).forEach(row => {
        const tr = document.createElement('tr');

        row.forEach((cell, index) => {
          const td = document.createElement('td');
          if (index === 8 && cell.startsWith('http')) { // Coluna 9 = link
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
  </script>

</body>
</html>
