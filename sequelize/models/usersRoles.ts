import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize/types'

export interface UserRoleAttributes {
    user_id: string
    role_id: string
}

export interface UserRoleModel
    extends Model<UserRoleAttributes>,
        UserRoleAttributes {}

export class UserRole extends Model<UserRoleModel, UserRoleAttributes> {}
export type UserRoleStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserRoleModel
}

export function UserRoleFactory(sequelize: Sequelize): UserRoleStatic {
    return <UserRoleStatic>sequelize.define(
        'user_roles',
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            tableName: 'user_roles',
            schema: 'public',
        }
    )
}
