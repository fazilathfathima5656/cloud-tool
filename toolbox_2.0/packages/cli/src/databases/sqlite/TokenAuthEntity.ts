import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import {
	ITokenAuthDB,
} from '../../';

@Entity()
export class TokenAuthEntity implements ITokenAuthDB{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userID: number;

    @Column()
    @Length(4, 20)
    type: string;

    @Column()
    @Length(4, 20)
    token: string;

    @Column()
    verified: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
