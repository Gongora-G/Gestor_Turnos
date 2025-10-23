import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus, UserRole } from './users/entities/user.entity';
import { Club } from './users/entities/club.entity';
import { TipoMembresia } from './configuracion/entities/tipo-membresia.entity';
import { Cancha } from './configuracion/entities/cancha.entity';
import { ConfiguracionClub } from './configuracion/entities/configuracion-club.entity';
import { Turno } from './turnos/entities/turno.entity';
import { Socio } from './socios/entities/socio.entity';

// Configuración de base de datos
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres123',
  database: 'gestor_turnos',
  schema: 'auth',
  entities: [User, Club, TipoMembresia, Cancha, ConfiguracionClub, Turno, Socio],
  synchronize: false,
});

async function seedDemoUser() {
  try {
    await dataSource.initialize();
    console.log('🔗 Conectado a la base de datos');

    const userRepository = dataSource.getRepository(User);

    // Verificar si el usuario demo ya existe
    const existingUser = await userRepository.findOne({
      where: { email: 'demo@gestor.com' }
    });

    if (existingUser) {
      console.log('✅ Usuario demo ya existe');
      await dataSource.destroy();
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Crear el usuario demo
    const demoUser = userRepository.create({
      email: 'demo@gestor.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.CADDIE_MASTER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await userRepository.save(demoUser);
    console.log('✅ Usuario demo creado exitosamente');
    console.log('📧 Email: demo@gestor.com');
    console.log('🔑 Password: password123');

  } catch (error) {
    console.error('❌ Error creando usuario demo:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedDemoUser();