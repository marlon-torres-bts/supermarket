import { expect, use, request } from 'chai'
import chaiHttp from 'chai-http'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { v4 as uuidv4 } from 'uuid'
import { app } from '../../../src/index'
import {
    createUser,
    createUsers,
    FilledUser,
    UserDB,
} from '../../factories/user.factory'
import { cleanTable, saveUsersToDB } from '../../utils/queries'
import { getAllUsersDao, getUserByIdDao } from '../../../src/daos/user'
import { expectError } from '../../utils/expects'

use(chaiHttp)
use(deepEqualInAnyOrder)

describe('updateUser', () => {
    let users: UserDB[]
    let userToEdit: UserDB
    const usersCount = 2
    const baseUrl = '/users'

    async function expectUpdate(res: any, body: FilledUser) {
        expect(res.status).to.be.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body!.status).to.be.equal('success')
        expect(res.body!.message).to.be.equal(
            `User with id ${userToEdit.id} updated successfully`
        )

        const data = res.body.data
        expect(data).to.be.an('object')
        expect(data.id).to.be.equal(userToEdit.id)
        expect(data.first_name).to.be.equal(body.firstName)
        expect(data.last_name).to.be.equal(body.lastName)
        expect(data.email).to.be.equal(body.email)
        expect(data.status).to.be.equal('active')
        expect(data.created_at).to.exist
        expect(data.updated_at).to.exist
        expect(data.deleted_at).to.be.null

        const userDB = await getUserByIdDao(data.id)
        expect(userDB).to.exist
        expect(userDB).to.be.deep.equal(data)
    }

    async function expectNoUpdates() {
        const response = await getAllUsersDao()
        expect(response.rowCount).to.be.equal(usersCount)
        expect(response.rows).to.deep.equalInAnyOrder(users)
    }

    beforeEach(async () => {
        await cleanTable('users')
        const usersData = await createUsers(usersCount)
        users = await saveUsersToDB(usersData)
        userToEdit = users[0]
    })

    it('should update a user', async () => {
        const userData = createUser()

        request(app)
            .put(`${baseUrl}/${userToEdit.id}`)
            .send(userData)
            .end(async (_, res) => {
                await expectUpdate(res, userData)
            })
    })

    context('when the id is not a valid uuid', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .put(`${baseUrl}/invalid-id`)
                .send(userData)
                .end(async (_, res) => {
                    expectError(400, 'Provided id is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when the body is not sent', () => {
        it('should return a 400 error', async () => {
            request(app)
                .put(`${baseUrl}/${userToEdit.id}`)
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when firstName is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .put(`${baseUrl}/${userToEdit.id}`)
                .send({ ...userData, firstName: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when lastName is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .put(`${baseUrl}/${userToEdit.id}`)
                .send({ ...userData, lastName: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when email is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .put(`${baseUrl}/${userToEdit.id}`)
                .send({ ...userData, email: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when email is not a valid email', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .put(`${baseUrl}/${userToEdit.id}`)
                .send({ ...userData, email: 'not-valid-email' })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoUpdates()
                })
        })
    })

    context('when the user id does not exist', () => {
        it('should return a 404 error', async () => {
            const userData = createUser()
            const nonExistentId = uuidv4()

            request(app)
                .put(`${baseUrl}/${nonExistentId}`)
                .send(userData)
                .end(async (_, res) => {
                    expectError(
                        404,
                        `User with id ${nonExistentId} does not exists`,
                        res
                    )

                    await expectNoUpdates()
                })
        })
    })

    context(
        'when a user with the given email already exists on another user',
        () => {
            it('should return a 409 error', async () => {
                const userData = createUser()
                const userToCopy = users[1]

                request(app)
                    .put(`${baseUrl}/${userToEdit.id}`)
                    .send({ ...userData, email: userToCopy.email })
                    .end(async (_, res) => {
                        expectError(
                            409,
                            `User with email ${userToCopy.email} already exists`,
                            res
                        )

                        await expectNoUpdates()
                    })
            })
        }
    )

    context(
        'when the given email is the same as the current user email',
        () => {
            it('should update user', async () => {
                const userData = createUser()

                request(app)
                    .put(`${baseUrl}/${userToEdit.id}`)
                    .send({ ...userData, email: userToEdit.email })
                    .end(async (_, res) => {
                        await expectUpdate(res, userData)
                    })
            })
        }
    )
})
