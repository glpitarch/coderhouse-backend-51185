import chai from 'chai'
import supertest from 'supertest'
import app from './../src/app.js'
import userModel from './../src/dao/persistence/mongodb/models/user-model.js'
import cartModel from './../src/dao/persistence/mongodb/models/carts-model.js'

const expect = chai.expect
const requester = supertest(app)

describe('Sessions module testing', () => {
    let userCookie
    let adminCookie
    let userCartId
    let adminCartId

    beforeEach( async function() {
        this.timeout(10000)
    })

    after(async () => {
        await userModel.findOneAndDelete({ email: 'testingUser@gmail.com' })
        await userModel.findOneAndDelete({ email: 'testingAdmin@coder.com' })
        await cartModel.findByIdAndDelete({ _id: userCartId })
        await cartModel.findByIdAndDelete({ _id: adminCartId })
        process.exit()
    })

    it('It must SUCCESSFULLY create a USER', async () => {
            const userMock = {
                first_name: 'testing',
                last_name: 'user',
                email: 'testingUser@gmail.com',
                age: 30,
                password: '123'
            }
            const response = await requester.post('/api/session/register').send(userMock)
            const testingUser = await userModel.findOne({ email: 'testingUser@gmail.com' })
            userCartId = testingUser.cart._id
            expect(response.statusCode).to.be.equal(200)
            expect(response.body.status).to.be.equal("success")
            expect(testingUser.role).to.be.equal("user")
    })

    it('Creating a USER with an existing email must FAIL', async () => {
        const userMock = {
            first_name: 'testing_2',
            last_name: 'user_2',
            email: 'testingUser@gmail.com',
            age: 30,
            password: '123'
        }
        const response = await requester.post('/api/session/register').send(userMock)
        expect(response.ok).to.be.equal(false)
    })

    it('Creating a USER without password must FAIL', async () => {
        const userMock = {
            first_name: 'testing_3',
            last_name: 'user_3',
            email: 'testingUser3@gmail.com',
            age: 30,
            password: ''
        }
        const response = await requester.post('/api/session/register').send(userMock)
        expect(response.ok).to.be.equal(false)
    })

    it('It must SUCCESSFULLY create an ADMIN', async () => {
        const adminMock = {
            first_name: 'testing',
            last_name: 'admin',
            email: 'testingAdmin@coder.com',
            age: 30,
            password: 'adminCod3r123'
        }
        const response = await requester.post('/api/session/register').send(adminMock)
        const testingAdmin = await userModel.findOne({ email: 'testingAdmin@coder.com' })
        adminCartId = testingAdmin.cart._id
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(testingAdmin.role).to.be.equal("admin")
    })

    it('Login as a non-existent user must FAIL', async () => {
        const userMock = {
            email: 'nonexistentUser@gmail.com',
            password: '123'
        }
        const response = await requester.post('/api/session/login').send(userMock)
        expect(response.ok).to.be.equal(false)
    })

    it('Login must FAIL if password does not match with user registered email', async () => {
        const userMock = {
            email: 'testingUser@gmail.com',
            password: 'abc'
        }
        const response = await requester.post('/api/session/login').send(userMock)
        expect(response.ok).to.be.equal(false)
    })

    it('It must SUCCESSFULLY login an ADMIN and return a cookie', async () => {
        const adminMock = {
            email: 'testingAdmin@coder.com',
            password: 'adminCod3r123'
        }
        const response = await requester.post('/api/session/login').send(adminMock)
        const cookieResult = response.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok
        adminCookie = {
            name: cookieResult.split('=')[0],
            value: (cookieResult.split(';')[0]).split('=')[1]
        }
        expect(adminCookie.value).to.be.ok
    })

    it('It must SUCCESSFULLY login a USER and return a cookie', async () => {
        const userMock = {
            email: 'testingUser@gmail.com',
            password: '123'
        }
        const response = await requester.post('/api/session/login').send(userMock)
        const cookieResult = response.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok
        userCookie = {
            name: cookieResult.split('=')[0],
            value: (cookieResult.split(';')[0]).split('=')[1]
        }
        expect(userCookie.value).to.be.ok
    })

    it('It must SUCCESSFULLY send and destructure USERs cookie', async () => {
        const response = await requester.get('/api/session/current').set('Cookie', [`${ userCookie.name } = ${ userCookie.value }`])
        expect(response.body.payload.email).to.be.equal('testingUser@gmail.com')
    })

    it('It must SUCCESSFULLY send and destructure ADMINs cookie', async () => {
        const response = await requester.get('/api/session/current').set('Cookie', [`${ adminCookie.name } = ${ adminCookie.value }`])
        expect(response.body.payload.email).to.be.equal('testingAdmin@coder.com')
    })

    it('It must SUCCESSFULLY logout USER', async () => {
        const response = await requester.get('/api/session/logout').set('Cookie', [`${ userCookie.name } = ${ userCookie.value }`])
        expect(response.statusCode).to.be.equal(302)
        expect(response.headers.location).to.be.equal('/')
    })
})