document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tablaMultas');
  const tbody = tabla.querySelector('tbody');
  const noMultas = document.getElementById('no-multas');

  const totalComparendosEl = document.getElementById('totalComparendos');
  const totalMultasEl = document.getElementById('totalMultas');
  const totalAcuerdosEl = document.getElementById('totalAcuerdos');
  const totalValorEl = document.getElementById('totalValor');
  const totalPagarEl = document.getElementById('totalPagar');

  const result = JSON.parse(localStorage.getItem('resultado_consulta'));

  if (!result || !result.success || !Array.isArray(result.data)) { 
  noMultas.style.display = 'block';
  document.getElementById('contenidoConDatos').style.display = 'none';
  return;
}

  // ===== FUNCIÓN PARA LIMPIAR MONEDA =====
  function parseCOP(valor) {
    if (!valor) return 0;
    return Number(
      valor
        .toString()
        .split('\n')[0]
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '')
        .trim()
    ) || 0;
  }

  let totalInicial = 0;

  // ===== CONSTRUIR TABLA =====
  result.data.forEach(m => {
    const valor = parseCOP(m.valorPagar);
    totalInicial += valor;

    const row = `
      <tr>
        <td>${m.tipo}</td>
        <td>${m.notificacion}</td>
        <td>${m.placa}</td>
        <td>${m.secretaria}</td>
        <td><em class="bx bx-cctv mr-1 fs-18 text-muted"></em>${m.infraccion}</td>
        <td>${m.estado}</td>
        <td>${m.valor}</td>
        <td>      
        
        <div  class="custom-control custom-checkbox"> 
          <input 
            type="checkbox" 
            class="chk-multa" 
            data-valor="${valor}"
          ></div>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });

  // ===== RESUMEN =====
  totalComparendosEl.innerText = result.data.length;
  totalMultasEl.innerText = result.data.length;
  totalAcuerdosEl.innerText = 0;
  // 🔒 TOTAL FIJO DEL RESUMEN (NO SE TOCA MÁS)
  totalValorEl.innerText = `$ ${totalInicial.toLocaleString('es-CO')}`;

  // al inicio no hay selección

  totalPagarEl.innerText = '$ 0';

  // ===== RECALCULAR TOTAL =====
  function recalcularTotal() {
    let total = 0;

    document.querySelectorAll('.chk-multa:checked').forEach(chk => {
      total += Number(chk.dataset.valor);
    });


    totalPagarEl.innerText = `$ ${total.toLocaleString('es-CO')}`;
  }

  // ===== ESCUCHAR CHECKBOX =====
  document.querySelectorAll('.chk-multa').forEach(chk => {
    chk.addEventListener('change', recalcularTotal);
  });
  function validarBotonPagar() {
    const checks = document.querySelectorAll('.chk-multa');
    const btnPagar = document.getElementById('btnPagar');

    const haySeleccionadas = Array.from(checks).some(chk => chk.checked);

    btnPagar.disabled = !haySeleccionadas;
    
  }
  document.addEventListener('change', (e) => {
  if (e.target.classList.contains('chk-multa')) {
    validarBotonPagar();
  }
});



  tabla.style.display = 'table';
});

  const params = new URLSearchParams(window.location.search);
  const placa = params.get('placa');

  if (placa) {
    const input = document.getElementById('placaDetail');
    if (input) {
      input.value = placa;
    }
  }

   // CONSULTA DE DATOS!

  document.getElementById('formConsulta').addEventListener('submit', async (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value.trim();
  if (!placa) return;

  // mostrar loader
  document.getElementById('loader').style.display = 'flex';

  try {
    const res = await fetch('/consultar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placa })
    });

    const result = await res.json();

    localStorage.setItem('resultado_consulta', JSON.stringify(result));
    localStorage.setItem('placa_consulta', placa);
    
     window.location.href = `/detail.html?placa=${encodeURIComponent(placa)}`;

  } catch (err) {
    document.getElementById('loader').style.display = 'none';
    console.error(err);
  }

  
});