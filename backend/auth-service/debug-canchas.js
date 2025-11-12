const { Client } = require('pg');

async function debugCanchas() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'gestor_turnos',
    user: 'postgres',
    password: 'postgres123',
  });

  try {
    await client.connect();
    console.log('🔌 Conectado a la base de datos');

    // Consultar canchas
    console.log('\n🏟️ === CANCHAS ===');
    const canchasResult = await client.query('SELECT id, nombre, tipo, activa FROM canchas ORDER BY nombre');
    console.log('Canchas encontradas:', canchasResult.rows.length);
    canchasResult.rows.forEach(cancha => {
      console.log(`- ${cancha.id.substring(0, 8)}... | ${cancha.nombre} | ${cancha.tipo} | ${cancha.activa ? 'Activa' : 'Inactiva'}`);
    });

    // Consultar turnos con información de cancha
    console.log('\n🎾 === TURNOS (últimos 10) ===');
    const turnosResult = await client.query(`
      SELECT t.id, t.cancha_id, t.numero_cancha, t.estado, t.cliente_nombre, 
             t.fecha_inicio, c.nombre as cancha_nombre
      FROM turnos t 
      LEFT JOIN canchas c ON t.cancha_id = c.id 
      ORDER BY t.created_at DESC 
      LIMIT 10
    `);
    console.log('Turnos encontrados:', turnosResult.rows.length);
    turnosResult.rows.forEach(turno => {
      console.log(`- Turno ${turno.id.substring(0, 8)}... | Cancha ID: ${turno.cancha_id?.substring(0, 8) || 'NULL'} | Número: ${turno.numero_cancha || 'NULL'} | Nombre: ${turno.cancha_nombre || 'N/A'} | Cliente: ${turno.cliente_nombre || 'N/A'}`);
    });

    // Consultar registros de jornada
    console.log('\n📋 === REGISTROS JORNADA ===');
    const registrosResult = await client.query(`
      SELECT id, nombre, fecha, turnos_registrados::text
      FROM registro_jornada 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    console.log('Registros encontrados:', registrosResult.rows.length);
    registrosResult.rows.forEach(registro => {
      console.log(`\n- Registro: ${registro.nombre} (${registro.fecha})`);
      try {
        const turnos = JSON.parse(registro.turnos_registrados);
        console.log(`  Turnos en JSON (${turnos.length}):`);
        turnos.slice(0, 3).forEach((turno, i) => {
          console.log(`    ${i+1}. numeroCancha: ${turno.numeroCancha || 'NULL'} | cancha: ${turno.cancha || 'NULL'} | cliente: ${turno.clienteNombre || 'N/A'}`);
        });
      } catch (e) {
        console.log('  Error parsing JSON:', e.message);
      }
    });

  } catch (error) {
    console.error('❌ Error completo:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de la base de datos');
  }
}

debugCanchas();