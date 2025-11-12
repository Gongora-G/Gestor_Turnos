import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCaddiesBoleadores1737469200000 implements MigrationInterface {
    name = 'AddCaddiesBoleadores1737469200000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla caddies
        await queryRunner.query(`
            CREATE TABLE "auth"."caddies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(100) NOT NULL,
                "apellido" character varying(100) NOT NULL,
                "telefono" character varying(20),
                "email" character varying(200),
                "especialidades" text,
                "nivel_experiencia" integer NOT NULL DEFAULT '1',
                "tarifa_por_hora" numeric(8,2),
                "estado" character varying(50) NOT NULL DEFAULT 'disponible',
                "horarios_disponibles" text,
                "notas" text,
                "activo" boolean NOT NULL DEFAULT true,
                "club_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_caddies" PRIMARY KEY ("id")
            )
        `);

        // Crear tabla boleadores
        await queryRunner.query(`
            CREATE TABLE "auth"."boleadores" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(100) NOT NULL,
                "apellido" character varying(100) NOT NULL,
                "telefono" character varying(20),
                "email" character varying(200),
                "nivel_juego" character varying(50) NOT NULL DEFAULT 'intermedio',
                "deportes" text,
                "ranking_habilidad" integer NOT NULL DEFAULT '3',
                "tarifa_por_hora" numeric(8,2),
                "estado" character varying(50) NOT NULL DEFAULT 'disponible',
                "horarios_disponibles" text,
                "preferencias" text,
                "notas" text,
                "activo" boolean NOT NULL DEFAULT true,
                "club_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_boleadores" PRIMARY KEY ("id")
            )
        `);

        // Agregar campos caddie_id y boleador_id a la tabla turnos
        await queryRunner.query(`
            ALTER TABLE "auth"."turnos" 
            ADD COLUMN "caddie_id" uuid,
            ADD COLUMN "boleador_id" uuid
        `);

        // Crear foreign keys
        await queryRunner.query(`
            ALTER TABLE "auth"."caddies" 
            ADD CONSTRAINT "FK_caddies_club" 
            FOREIGN KEY ("club_id") REFERENCES "auth"."clubs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "auth"."boleadores" 
            ADD CONSTRAINT "FK_boleadores_club" 
            FOREIGN KEY ("club_id") REFERENCES "auth"."clubs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "auth"."turnos" 
            ADD CONSTRAINT "FK_turnos_caddie" 
            FOREIGN KEY ("caddie_id") REFERENCES "auth"."caddies"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "auth"."turnos" 
            ADD CONSTRAINT "FK_turnos_boleador" 
            FOREIGN KEY ("boleador_id") REFERENCES "auth"."boleadores"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        // Crear índices para mejor performance
        await queryRunner.query(`CREATE INDEX "IDX_caddies_club_id" ON "auth"."caddies" ("club_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_caddies_estado" ON "auth"."caddies" ("estado")`);
        await queryRunner.query(`CREATE INDEX "IDX_caddies_activo" ON "auth"."caddies" ("activo")`);
        
        await queryRunner.query(`CREATE INDEX "IDX_boleadores_club_id" ON "auth"."boleadores" ("club_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_boleadores_estado" ON "auth"."boleadores" ("estado")`);
        await queryRunner.query(`CREATE INDEX "IDX_boleadores_activo" ON "auth"."boleadores" ("activo")`);
        
        await queryRunner.query(`CREATE INDEX "IDX_turnos_caddie_id" ON "auth"."turnos" ("caddie_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_turnos_boleador_id" ON "auth"."turnos" ("boleador_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índices
        await queryRunner.query(`DROP INDEX "auth"."IDX_turnos_boleador_id"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_turnos_caddie_id"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_boleadores_activo"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_boleadores_estado"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_boleadores_club_id"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_caddies_activo"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_caddies_estado"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_caddies_club_id"`);

        // Eliminar foreign keys
        await queryRunner.query(`ALTER TABLE "auth"."turnos" DROP CONSTRAINT "FK_turnos_boleador"`);
        await queryRunner.query(`ALTER TABLE "auth"."turnos" DROP CONSTRAINT "FK_turnos_caddie"`);
        await queryRunner.query(`ALTER TABLE "auth"."boleadores" DROP CONSTRAINT "FK_boleadores_club"`);
        await queryRunner.query(`ALTER TABLE "auth"."caddies" DROP CONSTRAINT "FK_caddies_club"`);

        // Eliminar columnas de turnos
        await queryRunner.query(`ALTER TABLE "auth"."turnos" DROP COLUMN "boleador_id"`);
        await queryRunner.query(`ALTER TABLE "auth"."turnos" DROP COLUMN "caddie_id"`);

        // Eliminar tablas
        await queryRunner.query(`DROP TABLE "auth"."boleadores"`);
        await queryRunner.query(`DROP TABLE "auth"."caddies"`);
    }
}