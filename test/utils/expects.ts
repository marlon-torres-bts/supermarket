import { expect } from 'chai'

export function expectError(code: number, message: string, res: any) {
    expect(res.status).to.be.equal(code)
    expect(res.body).to.be.an('object')
    expect(res.body.status).to.be.equal('error')
    expect(res.body.message).to.be.equal(message)
    expect(res.body.data).to.be.an('object')
    expect(res.body.data).to.deep.equal({})
}
