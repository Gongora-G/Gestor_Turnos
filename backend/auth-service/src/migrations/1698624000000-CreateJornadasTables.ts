import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJornadasTables1698624000000 implements MigrationInterface {
    name = 'CreateJornadasTables1698624000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla jornadas_config
        await queryRunner.query(`
            CREATE TABLE "jornadas_config" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "club_id" uuid NOT NULL,
                "nombre" character varying(100) NOT NULL,
                "descripcion" text,
                "hora_inicio" character varying(5) NOT NULL,
                "hora_fin" character varying(5) NOT NULL,
                "activa" boolean NOT NULL DEFAULT true,
                "orden" integer NOT NULL,
                "dias_semana" text NOT NULL,
                "color" character varying(7),
                "configurado_por" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_jornadas_config" PRIMARY KEY ("id")
            )
        `);

        // Crear tabla configuracion_jornadas
        await queryRunner.query(`
            CREATE TABLE "configuracion_jornadas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "club_id" uuid NOT NULL,
                "jornada_actual_id" uuid,
                "rotacion_automatica" boolean NOT NULL DEFAULT true,
                "configurado_por" uuid NOT NULL,
                "fecha_configuracion" TIMESTAMP NOT NULL DEFAULT now(),
                "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_configuracion_jornadas" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_configuracion_jornadas_club" UNIQUE ("club_id")
            )
        `);

        // Crear tabla registros_jornadas
        await queryRunner.query(`
            CREATE TABLE "registros_jornadas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "club_id" uuid NOT NULL,
                "jornada_config_id" uuid NOT NULL,
                "fecha" date NOT NULL,
                "hora_inicio" character varying(5) NOT NULL,
                "hora_fin" character varying(5),
                "turnos_registrados" jsonb NOT NULL DEFAULT '[]',
                "estadisticas" jsonb NOT NULL DEFAULT '{}',
                "estado" character varying CHECK ("estado" IN ('activa', 'completada', 'cancelada')) NOT NULL DEFAULT 'activa',
                "observaciones" text,
                "creado_por" uuid NOT NULL,
                "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fecha_cierre" TIMESTAMP,
                CONSTRAINT "PK_registros_jornadas" PRIMARY KEY ("id")
            )
        `);

        // Crear índices para rendimiento
        await queryRunner.query(`CREATE INDEX "IDX_jornadas_config_club_id" ON "jornadas_config" ("club_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_jornadas_config_activa" ON "jornadas_config" ("activa")`);
        await queryRunner.query(`CREATE INDEX "IDX_jornadas_config_orden" ON "jornadas_config" ("orden")`);
        
        await queryRunner.query(`CREATE INDEX "IDX_configuracion_jornadas_club_id" ON "configuracion_jornadas" ("club_id")`);
        
        await queryRunner.query(`CREATE INDEX "IDX_registros_jornadas_club_id" ON "registros_jornadas" ("club_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_registros_jornadas_fecha" ON "registros_jornadas" ("fecha")`);
        await queryRunner.query(`CREATE INDEX "IDX_registros_jornadas_estado" ON "registros_jornadas" ("estado")`);

        // Crear foreign keys
        await queryRunner.query(`
            ALTER TABLE "jornadas_config" 
            ADD CONSTRAINT "FK_jornadas_config_configurado_por" 
            FOREIGN KEY ("configurado_por") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "configuracion_jornadas" 
            ADD CONSTRAINT "FK_configuracion_jornadas_configurado_por" 
            FOREIGN KEY ("configurado_por") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "configuracion_jornadas" 
            ADD CONSTRAINT "FK_configuracion_jornadas_jornada_actual" 
            FOREIGN KEY ("jornada_actual_id") REFERENCES "jornadas_config"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "registros_jornadas" 
            ADD CONSTRAINT "FK_registros_jornadas_jornada_config" 
            FOREIGN KEY ("jornada_config_id") REFERENCES "jornadas_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "registros_jornadas" 
            ADD CONSTRAINT "FK_registros_jornadas_creado_por" 
            FOREIGN KEY ("creado_por") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

        // Insertar datos de ejemplo para testing
        await queryRunner.query(`
            INSERT INTO "jornadas_config" 
            ("club_id", "nombre", "descripcion", "hora_inicio", "hora_fin", "orden", "dias_semana", "color", "configurado_por")
            SELECT 
                '550e8400-e29b-41d4-a716-446655440000',
                'Jornada A',
                'Jornada matutina',
                '07:00',
                '12:00',
                1,
                'lunes,martes,miercoles,jueves,viernes,sabado,domingo',
                '#3B82F6',
                u.id
            FROM "users" u 
            WHERE u.email = 'admin@testclub.com'
            LIMIT 1
        `);

        await queryRunner.query(`
            INSERT INTO "jornadas_config" 
            ("club_id", "nombre", "descripcion", "hora_inicio", "hora_fin", "orden", "dias_semana", "color", "configurado_por")
            SELECT 
                '550e8400-e29b-41d4-a716-446655440000',
                'Jornada B',
                'Jornada vespertina',
                '15:00',
                '21:00',
                2,
                'lunes,martes,miercoles,jueves,viernes,sabado,domingo',
                '#10B981',
                u.id
            FROM "users" u 
            WHERE u.email = 'admin@testclub.com'
            LIMIT 1
        `);

        console.log('✅ Tablas de jornadas creadas exitosamente');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign keys
        await queryRunner.query(`ALTER TABLE "registros_jornadas" DROP CONSTRAINT "FK_registros_jornadas_creado_por"`);
        await queryRunner.query(`ALTER TABLE "registros_jornadas" DROP CONSTRAINT "FK_registros_jornadas_jornada_config"`);
        await queryRunner.query(`ALTER TABLE "configuracion_jornadas" DROP CONSTRAINT "FK_configuracion_jornadas_jornada_actual"`);
        await queryRunner.query(`ALTER TABLE "configuracion_jornadas" DROP CONSTRAINT "FK_configuracion_jornadas_configurado_por"`);
        await queryRunner.query(`ALTER TABLE "jornadas_config" DROP CONSTRAINT "FK_jornadas_config_configurado_por"`);

        // Eliminar índices
        await queryRunner.query(`DROP INDEX "IDX_registros_jornadas_estado"`);
        await queryRunner.query(`DROP INDEX "IDX_registros_jornadas_fecha"`);
        await queryRunner.query(`DROP INDEX "IDX_registros_jornadas_club_id"`);
        await queryRunner.query(`DROP INDEX "IDX_configuracion_jornadas_club_id"`);
        await queryRunner.query(`DROP INDEX "IDX_jornadas_config_orden"`);
        await queryRunner.query(`DROP INDEX "IDX_jornadas_config_activa"`);
        await queryRunner.query(`DROP INDEX "IDX_jornadas_config_club_id"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE "registros_jornadas"`);
        await queryRunner.query(`DROP TABLE "configuracion_jornadas"`);
        await queryRunner.query(`DROP TABLE "jornadas_config"`);

        console.log('✅ Tablas de jornadas eliminadas');
    }
}