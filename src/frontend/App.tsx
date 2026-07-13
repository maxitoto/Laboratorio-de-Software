import { useEffect, useState } from 'react';
import type { Agente, Vehiculo } from '@models/schema'; 

function App() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [error, setError] = useState<string>('');
  const [exito, setExito] = useState<string>('');

  // Estados para el formulario de asignación (Transacción)
  const [legajoInput, setLegajoInput] = useState('');
  const [dominioInput, setDominioInput] = useState('');

  const cargarAgentes = () => {
    window.apis.servicioBD.obtenerAgentes()
      .then(setAgentes)
      .catch(err => setError(err.message));
  };

  const cargarVehiculos = () => {
    window.apis.servicioBD.obtenerVehiculos()
      .then(setVehiculos)
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    cargarAgentes();
    cargarVehiculos();
  }, []);

  const agregarAgentePrueba = () => {
    setError(''); setExito('');
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    
    window.apis.servicioBD.registrarNuevoAgente({
      legajo: `AG-${numeroAleatorio}`,
      nombre: `Oficial de Prueba ${numeroAleatorio}`,
      rango: 'Sargento',
      hubAsignado: 'Ushuaia',
      estado: 'Inactivo' // Lo creamos inactivo para que la transacción lo active
    })
    .then(() => {
      setExito(`Agente AG-${numeroAleatorio} creado correctamente.`);
      cargarAgentes();
      cargarVehiculos();
    })
    .catch(err => setError(err.message));
  };

  const probarTransaccion = () => {
    setError(''); setExito('');
    if (!legajoInput || !dominioInput) {
      setError('Por favor, ingresa un legajo y un dominio.');
      return;
    }

    // Aquí invocamos la transacción ACID a través de nuestro IPC tipado
    window.apis.servicioBD.asignarPatrullero(legajoInput, dominioInput)
      .then((resultado) => {
        setExito(resultado);
        setLegajoInput('');
        setDominioInput('');
        cargarAgentes();
        cargarVehiculos();
      })
      .catch((err) => {
        // Si el vehículo no existe, Drizzle hace Rollback y el error llega hasta React
        setError(err.message);
      });
  };

  const agregarVehiculoPrueba = () =>{
    setError(''); setExito('');
    const numeroAleatorio = Math.floor(Math.random() * 1000);
    
    window.apis.servicioBD.registrarNuevoVehiculo({
      dominio: `VH-${numeroAleatorio}`,
      modelo: `Modelo de Prueba ${numeroAleatorio}`,
      agenteId: null
    })
    .then(() => {
      setExito(`Vehículo VH-${numeroAleatorio} creado correctamente.`);
      cargarVehiculos();
    })
    .catch(err => setError(err.message));
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Sistema Provincial - Nodo Ushuaia</h1>
      
      {/* Panel de Mensajes */}
      {error && <div style={{ background: '#440000', color: '#ffb3b3', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>❌ {error}</div>}
      {exito && <div style={{ background: '#003300', color: '#b3ffb3', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>✅ {exito}</div>}

      {/* Panel de Asignación (Prueba de dbCommunication) */}
      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>Asignar Patrullero (Prueba Transaccional)</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Legajo (Ej: AG-123)" 
            value={legajoInput} 
            onChange={(e) => setLegajoInput(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: 'white' }}
          />
          <input 
            type="text" 
            placeholder="Vehículo (Ej: VH-123)" 
            value={dominioInput} 
            onChange={(e) => setDominioInput(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #555', background: '#333', color: 'white' }}
          />
          <button onClick={probarTransaccion} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}>
            Ejecutar Transacción
          </button>
        </div>
        <p style={{ color: '#888', fontSize: '0.85em', marginTop: '0.5rem' }}>
          Intenta asignar un vehículo que no existe. Verás cómo el error viaja desde SQLite hasta el Frontend gracias al IPC seguro.
        </p>
      </div>

      <button onClick={agregarAgentePrueba} style={{ padding: '0.6em 1.2em', marginBottom: '1rem', cursor: 'pointer' }}>
        + Añadir Agente de Prueba
      </button>
      <button onClick={agregarVehiculoPrueba} style={{ padding: '0.6em 1.2em', marginBottom: '1rem', cursor: 'pointer' }}>
        + Añadir Vehículo de Prueba
      </button>
      <div style={{columnGap: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '1rem'}}>
    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'left'}}>
        <h3>Agentes Registrados:</h3>
        {agentes.length === 0 ? (
          <p style={{ color: '#888' }}>No hay agentes registrados.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {agentes.map(ag => (
              <li key={ag.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{ag.legajo}</strong> - {ag.nombre}</span>
                <span style={{ color: ag.estado === 'Activo' ? '#4caf50' : '#ff9800' }}>
                  {ag.estado} ({ag.hubAsignado})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'left'}}>
        <h3>Vehículos Registrados:</h3>
        {vehiculos.length === 0 ? (
          <p style={{ color: '#888' }}>No hay vehículos registrados.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {vehiculos.map(v => (
              <li key={v.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #333' }}>
                <span><strong>{v.dominio}</strong> - {v.modelo} - {v.agenteId ? 'Asignado a'+' '+agentes.find(a => a.id === v.agenteId)?.legajo : 'No asignado'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      
    </div>
  );
}

export default App;