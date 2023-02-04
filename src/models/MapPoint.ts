import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { MapToGuess } from "./MapToGuess";


@Table({ tableName: 'map_points'})
export class MapPoint extends Model<MapPoint> {

    @Column({field: 'id', type: DataType.INTEGER, allowNull: true, primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => MapToGuess)
    @Column({
        field: 'map_id',
        type: DataType.INTEGER,
        references: { model: 'map', key: 'id' }
    })
    mapId: number;

    @Column({field: 'x', type: DataType.FLOAT})
    x: number;

    @Column({field: 'y', type: DataType.FLOAT})
    y: number;

    @Column({field: 'width', type: DataType.FLOAT})
    width: number;
    
    @Column({field: 'possible_answers', type: DataType.STRING})
    possibleAnswers: string;
    
    @Column({field: 'label', type: DataType.STRING})
    label: string;

    @BelongsTo(() => MapToGuess)
    map: MapToGuess



}
