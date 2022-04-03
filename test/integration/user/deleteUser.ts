import { expect, use, request } from 'chai'
import chaiHttp from 'chai-http'
import { createUser, UserDB } from '../../factories/user.factory'
import { cleanTable, saveUsersToDB } from '../../utils/queries'
import { app } from '../../../src/index'
import { v4 as uuidv4 } from 'uuid'
import { getUserByIdDao, getAllUsersDao } from '../../../src/daos/user'
import { expectError } from '../../utils/expects'

use(chaiHttp)

describe('deleteUser', () => {
    let user: UserDB
    const baseUrl = '/users'

    async function expectNoDeletes() {
        const response = await getAllUsersDao()
        expect(response.rowCount).to.be.equal(1)
    }

    beforeEach(async () => {
        await cleanTable('users')
        const userData = await createUser()
        user = (await saveUsersToDB([userData]))[0]
    })

    it('should delete a user', async () => {
        request(app)
            .delete(`${baseUrl}/${user.id}`)
            .end(async (_, res) => {
                expect(res.status).to.be.equal(200)

                expect(res.body).to.be.an('object')
                expect(res.body.status).to.be.equal('success')
                expect(res.body.message).to.be.equal(
                    `User with id ${user.id} deleted successfully`
                )

                expect(res.body.data).to.be.an('object')
                expect(res.body.data).to.deep.equal({})

                const deletedUser = await getUserByIdDao(user.id)
                expect(deletedUser.rowCount).to.be.equal(0)
                expect(deletedUser.rows).to.be.deep.equal([])
            })
    })

    context('when the given id is not a uuid', () => {
        it('should return a 400 error', async () => {
            request(app)
                .delete(`${baseUrl}/not-a-uuid`)
                .end(async (_, res) => {
                    expectError(400, 'Provided user id is not valid', res)
                    await expectNoDeletes()
                })
        })
    })

    context('when the given id does not exist', () => {
        it('should return a 404 error', async () => {
            const nonExistentId = uuidv4()
            request(app)
                .delete(`${baseUrl}/${nonExistentId}`)
                .end(async (_, res) => {
                    expectError(
                        404,
                        `User with id ${nonExistentId} not found`,
                        res
                    )

                    await expectNoDeletes()
                })
        })
    })
})
