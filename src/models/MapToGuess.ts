import {Column, DataType, Model, Table, HasMany} from "sequelize-typescript";
import { MapPoint } from "./MapPoint";


@Table({ tableName: 'map'})
export class MapToGuess extends Model<MapToGuess> {

    @Column({field: 'id', type: DataType.INTEGER, allowNull: true, primaryKey: true, autoIncrement: true})
    id: number;

    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        references: { model: 'user', key: 'id' }
    })
    userId: number;

    @Column({field: 'title', type: DataType.STRING, defaultValue: ''})
    title: string;

    @Column({field: 'description', type: DataType.STRING, defaultValue: ''})
    description: string;

    @Column({field: 'file_name', type: DataType.STRING, allowNull: false})
    fileName: string;

    @HasMany(() => MapPoint)
    points: MapPoint[];
}
