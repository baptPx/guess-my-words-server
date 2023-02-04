import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { MapPoint } from "./MapPoint";
import { MapToGuess } from "./MapToGuess";
import { User } from "./User";


@Table({ tableName: 'map_answer'})
export class MapAnswer extends Model<MapAnswer> {

    @Column({field: 'id', type: DataType.INTEGER, allowNull: true, primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => MapPoint)
    @Column({
        field: 'map_point_id',
        type: DataType.INTEGER,
        references: { model: 'map_points', key: 'id' }
    })
    mapPointId: number;

    @ForeignKey(() => User)
    @Column({
        field: 'user_id',
        type: DataType.INTEGER,
        references: { model: 'user', key: 'id' }
    })
    userId: number;

    @BelongsTo(() => MapPoint)
    mapPoint: MapPoint

    @BelongsTo(() => User)
    user: User

}
