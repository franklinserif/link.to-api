import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1727273564853 implements MigrationInterface {
  name = 'Init1727273564853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "visits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "browser" character varying, "country" character varying, "location" character varying, "ip" character varying, "os" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "linkId" uuid, CONSTRAINT "PK_0b0b322289a41015c6ea4e8bf30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url_original" text NOT NULL, "short_URL" text NOT NULL, "status" boolean NOT NULL DEFAULT true, "expirationDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_6da0bc7a4d36217d73bef991d15" UNIQUE ("short_URL"), CONSTRAINT "PK_f349e17079b4e03580647d37a4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" ADD CONSTRAINT "FK_87f69b2e91e60d03a2491133038" FOREIGN KEY ("linkId") REFERENCES "Links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Links" ADD CONSTRAINT "FK_86035ab9fa38661d8b06004d834" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Links" DROP CONSTRAINT "FK_86035ab9fa38661d8b06004d834"`,
    );
    await queryRunner.query(
      `ALTER TABLE "visits" DROP CONSTRAINT "FK_87f69b2e91e60d03a2491133038"`,
    );
    await queryRunner.query(`DROP TABLE "Links"`);
    await queryRunner.query(`DROP TABLE "visits"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
