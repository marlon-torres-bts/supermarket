import { DataTypes } from 'sequelize/types'

export interface Dates {
    created_at: Date
    updated_at?: Date
}

export const dates = {
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}
