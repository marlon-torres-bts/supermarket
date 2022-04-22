import { Op, QueryInterface } from 'sequelize/types'
import { rolesData } from './data/rolesData'

export function up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert(
        { tableName: 'roles', schema: 'public' },
        rolesData
    )
}

export function down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete(
        { tableName: 'roles', schema: 'public' },
        { name: { [Op.in]: rolesData.map((role) => role.name) } }
    )
}
