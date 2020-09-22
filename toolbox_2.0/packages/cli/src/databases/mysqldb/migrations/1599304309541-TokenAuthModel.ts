import { MigrationInterface, QueryRunner } from "typeorm";
import * as config from '../../../../config';

export class TokenAuthModel1599304309541 implements MigrationInterface {
    name = 'TokenAuthModel1599304309541';
    async up(queryRunner: QueryRunner): Promise<void> {
        const tablePrefix = config.get('database.tablePrefix');
        
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `' + tablePrefix + 'token_auth_entity` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(128) NOT NULL, `token` varchar(128), `userID` int NOT NULL,`verified` boolean NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);

    }

    async down(queryRunner: QueryRunner): Promise<void> {
    }

}
