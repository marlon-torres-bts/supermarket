import { expect, use, request } from 'chai'
import chaiHttp from 'chai-http'
import { UserDB, createUser } from '../../factories/user.factory'
import { cleanTable, saveUsersToDB } from '../../utils/queries'
import { app } from '../../../src/index'
import { v4 as uuidv4 } from 'uuid'
import { expectError } from '../../utils/expects'

use(chaiHttp)

describe('getUser', () => {
    let user: UserDB
    const baseUrl = '/users'

    beforeEach(async () => {
        await cleanTable('users')
        const userData = await createUser()
        user = (await saveUsersToDB([userData]))[0]
    })

    it('should return a single user', async () => {
        request(app)
            .get(`${baseUrl}/${user.id}`)
            .end((_, res) => {
                expect(res.status).to.be.equal(200)

                expect(res.body).to.be.an('object')
                expect(res.body.status).to.be.equal('success')
                expect(res.body.message).to.be.equal(
                    `User with id ${user.id} retrieved successfully`
                )

                expect(res.body.data).to.be.an('object')
                expect(res.body.data).to.deep.equal(user)
            })
    })

    context('when the given id is not a uuid', () => {
        it('should return a 400 error', async () => {
            request(app)
                .get(`${baseUrl}/not-a-uuid`)
                .end((_, res) => {
                    expectError(400, 'Provided user id is not valid', res)
                })
        })
    })

    context('when the given id does not exist', () => {
        it('should return a 404 error', async () => {
            const nonExistentId = uuidv4()
            request(app)
                .get(`${baseUrl}/${nonExistentId}`)
                .end((_, res) => {
                    expectError(
                        404,
                        `User with id ${nonExistentId} not found`,
                        res
                    )
                })
        })
    })
})
