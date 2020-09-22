import { MigrationInterface, QueryRunner } from "typeorm";

import * as config from '../../../../config';

export class CreateIndexStoppedAt1594825041918 implements MigrationInterface {
	name = 'CreateIndexStoppedAt1594825041918';

	async up(queryRunner: QueryRunner): Promise<void> {
		const tablePrefix = config.get('database.tablePrefix');

		await queryRunner.query(`CREATE INDEX "IDX_${tablePrefix}cefb067df2402f6aed0638a6c1" ON "execution_entity" ("stoppedAt") `);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		const tablePrefix = config.get('database.tablePrefix');

		await queryRunner.query(`DROP INDEX "IDX_${tablePrefix}cefb067df2402f6aed0638a6c1"`);
	}

}
