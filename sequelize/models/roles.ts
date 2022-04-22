import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize/types'
import { dates, Dates } from './shared/dates'

export interface RoleAttributes extends Dates {
    id: string
    name: string
}

export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}
export class Role extends Model<RoleModel, RoleAttributes> {}
export type RoleStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): RoleModel
}

export function RoleFactory(sequelize: Sequelize): RoleStatic {
    return <RoleStatic>sequelize.define(
        'roles',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            ...dates,
        },
        {
            tableName: 'roles',
            schema: 'public',
        }
    )
}
