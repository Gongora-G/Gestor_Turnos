import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddJornadaIdToTurnos1699367820000 implements MigrationInterface {
    name = 'AddJornadaIdToTurnos1699367820000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('turnos', new TableColumn({
            name: 'jornada_id',
            type: 'integer',
            isNullable: true,
            comment: 'ID de la jornada activa actual'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('turnos', 'jornada_id');
    }
}