// frontend/App.tsx
import { useEffect, useState } from 'react';

function App() {
  const [datosAgente, setDatosAgente] = useState('');
  const [estadoSincronizacion, setEstadoSincronizacion] = useState('');

  useEffect(() => {
    // PRUEBA 1: Borra el punto después de 'apis' y vuelve a escribirlo.
    // El IDE te sugerirá automáticamente 'servicioBD' y 'servicioDev'.
    // Luego borra el punto después de 'servicioBD' y te sugerirá los métodos.
    
    window.apis.servicioBD.getAgenteLocalizacion('1234')
      .then(agente => {
        // TypeScript sabe exactamente qué propiedades tiene 'agente'
        // Si escribes 'agente.', te sugerirá 'legajo', 'hubAsignado' y 'estado'
        setDatosAgente(`Agente ${agente.legajo} reportando desde ${agente.hubAsignado}`);
      })
      .catch(err => console.error('Error IPC:', err));

    // PRUEBA 2: Sitúa el cursor dentro de los paréntesis de registrarVehiculo.
    // Verás que el IDE te exige que el segundo parámetro sea obligatoriamente
    // 'Ushuaia', 'Rio Grande' o 'Tolhuin', previniendo errores de tipeo antes de compilar.
    
    window.apis.servicioBD.registrarVehiculo('AB123CD', 'Rio Grande')
      .then(respuesta => setEstadoSincronizacion(respuesta))
      .catch(err => console.error('Error IPC:', err));

  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Panel de Control de Base de Datos</h1>
      
      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>Localización:</h3>
        <code>{datosAgente || 'Consultando base de datos...'}</code>
      </div>

      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
        <h3>Sincronización de Nodos:</h3>
        <code>{estadoSincronizacion || 'A la espera de sincronización...'}</code>
      </div>
    </div>
  );
}

export default App;