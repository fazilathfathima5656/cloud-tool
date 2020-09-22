import { MigrationInterface, QueryRunner } from "typeorm";
import * as config from '../../../../config';



export class Usermodel1599235251766 implements MigrationInterface {
    name = 'Usermodel1599235251766';
    async up(queryRunner: QueryRunner): Promise<void> {
        const tablePrefix = config.get('database.tablePrefix');

        await queryRunner.query('CREATE TABLE IF NOT EXISTS `' + tablePrefix + 'users_entity` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(128) NOT NULL, `username` varchar(128) NOT NULL, `contact_number` varchar(128) NOT NULL,`password` varchar(128) NOT NULL,`status` varchar(128) NOT NULL,`loggedInAs` varchar(128) NOT NULL,`last_login` datetime NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, INDEX `IDX_' + tablePrefix + '07fde106c0b471d8cc80a64fc9` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);

    }

    async down(queryRunner: QueryRunner): Promise<void> {

    }

}
