import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table({ tableName: 'user'})
export class User extends Model<User> {
    @Column({field: 'username', type: DataType.STRING, unique: true})
    username: string;

    @Column({field: 'password', type: DataType.STRING})
    password: string;

    @Column({field: 'id', type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true})
    id: number;
}
