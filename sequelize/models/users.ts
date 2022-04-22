import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize'
import { dates, Dates } from './shared/dates'

export interface UserAttributes extends Dates {
    id: string
    first_name: string
    last_name: string
    email: string
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModel
}

export function UserFactory(sequelize: Sequelize): UserStatic {
    return <UserStatic>sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ...dates,
        },
        {
            tableName: 'users',
            schema: 'public',
        }
    )
}
