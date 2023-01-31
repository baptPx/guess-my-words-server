import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table({ tableName: 'map'})
export class Map extends Model<Map> {

    @Column({field: 'id', type: DataType.INTEGER, allowNull: true, primaryKey: true, autoIncrement: true})
    id: number;

    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        references: { model: 'user', key: 'id' }
    })
    userId: number;

    @Column({field: 'x', type: DataType.INTEGER})
    x: number;

    @Column({field: 'y', type: DataType.INTEGER})
    y: number;

    @Column({field: 'width', type: DataType.INTEGER})
    width: number;

    @Column({field: 'height', type: DataType.INTEGER})
    height: number;

    @Column({field: 'title', type: DataType.STRING, defaultValue: ''})
    title: string;

    @Column({field: 'description', type: DataType.STRING, defaultValue: ''})
    description: string;

}
