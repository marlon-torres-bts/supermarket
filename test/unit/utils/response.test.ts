import { expect } from 'chai'
import { buildResponse, DefaultResponse } from '../../../src/utils/response'

describe('response', () => {
    context('buildResponse', () => {
        it('should return a default response', () => {
            const expectedResponse: DefaultResponse = {
                status: 'success',
                message: 'This is a message',
                data: {
                    foo: 'bar',
                    bar: 'baz',
                },
            }

            const response = buildResponse(
                expectedResponse.status,
                expectedResponse.message,
                expectedResponse.data
            )

            expect(response).to.deep.equal(expectedResponse)
        })
    })
})
