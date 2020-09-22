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
	ITokenAuthDB,
} from '../../';
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class TokenAuthEntity implements ITokenAuthDB{
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userID: string;

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
