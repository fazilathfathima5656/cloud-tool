import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import {
	IUserhookDb,
} from '../../';

import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
export type StatusType = "active" | "pending" | "deleted" | "blocked";

@Entity()
@Unique(["username"])
export class UsersEntity implements IUserhookDb{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 20)
    // tslint:disable-next-line: variable-name
    contact_number: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column({
        type: "enum",
        enum: ["active", "pending", "blocked", "deleted"],
        default: "pending"
    })
    status: StatusType;

    @Column()
    @Length(4, 20)
    loggedInAs: string;

    @Column()
    @CreateDateColumn()
    // tslint:disable-next-line: variable-name
    last_login: Date;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}
