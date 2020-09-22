import {
    Entity,
    ObjectID,
	ObjectIdColumn,
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

@Unique(["username"])
@Entity()
export class UsersEntity implements IUserhookDb{
    @ObjectIdColumn()
	id: ObjectID;

    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 20)
    // tslint:disable-next-line: variable-name
    contact_number: number;

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
