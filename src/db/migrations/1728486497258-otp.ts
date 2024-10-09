import { MigrationInterface, QueryRunner } from "typeorm";

export class Otp1728486497258 implements MigrationInterface {
    name = 'Otp1728486497258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
    }

}
