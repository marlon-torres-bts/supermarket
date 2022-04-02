import { expect, use, request } from 'chai'
import chaiHttp from 'chai-http'
import { getAllUsersDao, getUserByIdDao } from '../../../src/daos/user'
import { app } from '../../../src/index'
import { createUser, UserDB } from '../../factories/user.factory'
import { expectError } from '../../utils/expects'
import { cleanTable, saveUsersToDB } from '../../utils/queries'

use(chaiHttp)

describe('createUser', () => {
    const baseUrl = '/users'

    async function expectNoCreations() {
        const response = await getAllUsersDao()
        expect(response.rowCount).to.be.equal(0)
    }

    beforeEach(async () => {
        await cleanTable('users')
    })

    it('should create a user', async () => {
        const userData = createUser()

        request(app)
            .post(baseUrl)
            .send(userData)
            .end(async (_, res) => {
                expect(res.status).to.be.equal(201)
                expect(res.body).to.be.an('object')
                expect(res.body.status).to.be.equal('success')
                expect(res.body.message).to.be.equal(
                    'User created successfully'
                )

                const data = res.body.data
                expect(data).to.be.an('object')
                expect(data.id).to.exist
                expect(data.first_name).to.be.equal(userData.firstName)
                expect(data.last_name).to.be.equal(userData.lastName)
                expect(data.email).to.be.equal(userData.email)
                expect(data.status).to.be.equal('active')
                expect(data.created_at).to.exist
                expect(data.updated_at).to.be.null
                expect(data.deleted_at).to.be.null

                const userDB = await getUserByIdDao(data.id)
                expect(userDB).to.exist
                expect(userDB).to.be.deep.equal(data)
            })
    })

    context('when the body is not sent', () => {
        it('should return a 400 error', async () => {
            request(app)
                .post(baseUrl)
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoCreations()
                })
        })
    })

    context('when firstName is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .post(baseUrl)
                .send({ ...userData, firstName: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoCreations()
                })
        })
    })

    context('when lastName is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .post(baseUrl)
                .send({ ...userData, lastName: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoCreations()
                })
        })
    })

    context('when email is missing', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .post(baseUrl)
                .send({ ...userData, email: undefined })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoCreations()
                })
        })
    })

    context('when email is not a valid email', () => {
        it('should return a 400 error', async () => {
            const userData = createUser()

            request(app)
                .post(baseUrl)
                .send({ ...userData, email: 'not-valid-email' })
                .end(async (_, res) => {
                    expectError(400, 'Provided body is not valid', res)
                    await expectNoCreations()
                })
        })
    })

    context('when a user with the given email already exists', () => {
        let user: UserDB

        beforeEach(async () => {
            const userData = createUser()
            user = (await saveUsersToDB([userData]))[0]
        })

        it('should return a 409 error', async () => {
            const userData = createUser()

            request(app)
                .post(baseUrl)
                .send({ ...userData, email: user.email })
                .end(async (_, res) => {
                    expectError(
                        409,
                        `User with email ${user.email} already exists`,
                        res
                    )

                    await expectNoCreations()
                })
        })
    })
})
