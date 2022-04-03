import { expect, use } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import chaiAsPromised from 'chai-as-promised'
import { v4 as uuidv4 } from 'uuid'
import chance from 'chance'
import {
    createUserDao,
    deleteUserDao,
    getAllUsersDao,
    getUserByEmailDao,
    getUserByIdDao,
    updateUserDao,
} from '../../../src/daos/user'
import { createUser, createUsers, UserDB } from '../../factories/user.factory'
import { cleanTable, saveUsersToDB } from '../../utils/queries'

use(deepEqualInAnyOrder)
use(chaiAsPromised)

describe('userDaos', () => {
    let users: UserDB[]
    const usersCount = 5

    beforeEach(async () => {
        await cleanTable('users')
        const usersData = await createUsers(usersCount)
        users = (await saveUsersToDB(usersData)).map((u) => {
            return {
                ...u,
                created_at: new Date(u.created_at),
            }
        })
    })

    context('getAllUsersDao', () => {
        it('gets all the existent users', async () => {
            const result = await getAllUsersDao()
            expect(result.rowCount).to.be.equal(usersCount)
            expect(result.rows).to.deep.equalInAnyOrder(users)
        })
    })

    context('getUserByIdDao', () => {
        it('gets a user by id', async () => {
            const user = users[0]
            const result = await getUserByIdDao(user.id)
            expect(result.rowCount).to.be.equal(1)
            expect(result.rows[0]).to.deep.equal(user)
        })

        context('if the user does not exist', () => {
            it('returns an empty array', async () => {
                const result = await getUserByIdDao(uuidv4())
                expect(result.rowCount).to.be.equal(0)
                expect(result.rows).to.be.empty
            })
        })
    })

    context('getUserByEmailDao', () => {
        it('gets a user by email', async () => {
            const user = users[0]
            const result = await getUserByEmailDao(user.email)
            expect(result.rowCount).to.be.equal(1)
            expect(result.rows[0]).to.deep.equal(user)
        })

        context('if the user email does not exist', () => {
            it('returns an empty array', async () => {
                const result = await getUserByEmailDao(chance().email())
                expect(result.rowCount).to.be.equal(0)
                expect(result.rows).to.be.empty
            })
        })
    })

    context('createUserDao', () => {
        it('creates a new user with the given data', async () => {
            const { firstName, lastName, email } = createUser()
            const result = await createUserDao(firstName, lastName, email)
            expect(result.rowCount).to.be.equal(1)

            const userId = result.rows[0].id
            expect(userId).to.exist

            const userDBResult = await getUserByIdDao(userId)
            expect(userDBResult.rowCount).to.be.equal(1)

            const userDB = userDBResult.rows[0]
            expect(userDB.first_name).to.be.equal(firstName)
            expect(userDB.last_name).to.be.equal(lastName)
            expect(userDB.email).to.be.equal(email)
        })
    })

    context('updateUserDao', () => {
        it('updates the given user with the new data', async () => {
            const user = users[0]
            const { firstName, lastName, email } = createUser()

            await updateUserDao(user.id, firstName, lastName, email)

            const userDBResult = await getUserByIdDao(user.id)
            expect(userDBResult.rowCount).to.be.equal(1)

            const userDB = userDBResult.rows[0]
            expect(userDB.first_name).to.be.equal(firstName)
            expect(userDB.last_name).to.be.equal(lastName)
            expect(userDB.email).to.be.equal(email)
        })

        context('if the user does not exist', () => {
            it('does not edit any user', async () => {
                const { firstName, lastName, email } = createUser()
                const userId = uuidv4()

                await updateUserDao(userId, firstName, lastName, email)

                const allUsersDBResult = await getAllUsersDao()
                expect(allUsersDBResult.rowCount).to.be.equal(usersCount)
                expect(allUsersDBResult.rows).to.deep.equalInAnyOrder(users)
            })
        })
    })

    context('deleteUserDao', () => {
        it('deletes the given user', async () => {
            const user = users[0]
            await deleteUserDao(user.id)

            const userDBResult = await getUserByIdDao(user.id)
            expect(userDBResult.rowCount).to.be.equal(0)
            expect(userDBResult.rows).to.be.empty
        })

        context('if the user does not exist', () => {
            it('does not delete any user', async () => {
                const userId = uuidv4()
                await deleteUserDao(userId)

                const allUsersDBResult = await getAllUsersDao()
                expect(allUsersDBResult.rowCount).to.be.equal(usersCount)
                expect(allUsersDBResult.rows).to.deep.equalInAnyOrder(users)
            })
        })
    })
})
