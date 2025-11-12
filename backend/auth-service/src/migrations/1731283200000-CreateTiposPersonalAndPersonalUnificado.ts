import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTiposPersonalAndPersonalUnificado1731283200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear tabla tipos_personal
    await queryRunner.query(`
      CREATE TABLE auth.tipos_personal (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(50) NOT NULL,
        descripcion TEXT,
        activo BOOLEAN DEFAULT true,
        campos_personalizados JSONB DEFAULT '[]'::jsonb,
        club_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(codigo, club_id)
      );
    `);

    // 2. Crear tabla personal unificada
    await queryRunner.query(`
      CREATE TABLE auth.personal (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(100),
        tipo_personal_id INTEGER NOT NULL REFERENCES auth.tipos_personal(id) ON DELETE RESTRICT,
        datos_especificos JSONB DEFAULT '{}'::jsonb,
        tarifa_por_hora DECIMAL(10,2),
        estado VARCHAR(20) DEFAULT 'disponible',
        horarios_disponibles TEXT,
        notas TEXT,
        activo BOOLEAN DEFAULT true,
        club_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Crear índices para mejor rendimiento
    await queryRunner.query(`
      CREATE INDEX idx_tipos_personal_club ON auth.tipos_personal(club_id);
      CREATE INDEX idx_tipos_personal_activo ON auth.tipos_personal(activo);
      CREATE INDEX idx_personal_tipo ON auth.personal(tipo_personal_id);
      CREATE INDEX idx_personal_club ON auth.personal(club_id);
      CREATE INDEX idx_personal_estado ON auth.personal(estado);
      CREATE INDEX idx_personal_activo ON auth.personal(activo);
    `);

    // 4. Insertar tipos de personal por defecto (sin club_id específico aún)
    // Esto se hará mediante seed después de crear clubs
    await queryRunner.query(`
      COMMENT ON TABLE auth.tipos_personal IS 'Tipos de personal configurables por club (Caddie, Boleador, Instructor, etc.)';
      COMMENT ON TABLE auth.personal IS 'Personal del club unificado con tipos dinámicos';
      COMMENT ON COLUMN auth.tipos_personal.campos_personalizados IS 'Array JSON con definición de campos adicionales específicos del tipo';
      COMMENT ON COLUMN auth.personal.datos_especificos IS 'Objeto JSON con valores de campos específicos según tipo_personal_id';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS auth.personal CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.tipos_personal CASCADE;`);
  }
}
