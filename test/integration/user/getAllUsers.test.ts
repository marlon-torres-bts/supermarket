import { expect, use, request } from 'chai'
import chaiHttp from 'chai-http'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { UserDB, createUsers } from '../../factories/user.factory'
import { cleanTable, saveUsersToDB } from '../../utils/queries'
import { app } from '../../../src/index'

use(chaiHttp)
use(deepEqualInAnyOrder)

describe('getAllUsers', () => {
    let users: UserDB[]
    const usersCount = 5
    const url = '/users'

    beforeEach(async () => {
        await cleanTable('users')
        const usersData = await createUsers(usersCount)
        users = await saveUsersToDB(usersData)
    })

    it('should return all users', async () => {
        request(app)
            .get(url)
            .end((_, res) => {
                expect(res.status).to.be.equal(200)

                expect(res.body).to.be.an('object')
                expect(res.body.status).to.be.equal('success')
                expect(res.body.message).to.be.equal(
                    'Users retrieved successfully'
                )

                expect(res.body.data).to.be.an('array')
                expect(res.body.data).to.have.lengthOf(usersCount)
                expect(res.body.data).to.deep.equalInAnyOrder(users)
            })
    })
})
