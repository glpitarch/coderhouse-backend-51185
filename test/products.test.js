import chai from 'chai'
import supertest from 'supertest'
import app from './../src/app.js'
import productModel from './../src/dao/persistence/mongodb/models/products-model.js'
import userModel from '../src/dao/persistence/mongodb/models/user-model.js'
import cartModel from './../src/dao/persistence/mongodb/models/carts-model.js'

const expect = chai.expect
const requester = supertest(app)

describe('Products module testing', () => {
    let userSessionCookie
    let adminSessionCookie
    let mockProduct_11_Id
    let userCartId
    let adminCartId

    beforeEach( async function() {
        this.timeout(10000)
    })

    after(async () => {
        await userModel.findOneAndDelete({ email: 'testingUser@gmail.com' })
        await userModel.findOneAndDelete({ email: 'testingAdmin@coder.com' })
        await productModel.deleteMany({ category: 'Test' })
        await cartModel.findByIdAndDelete({ _id: userCartId })
        await cartModel.findByIdAndDelete({ _id: adminCartId })
        process.exit()
    })


    it('Creating a PRODUCT by a user role must FAIL', async () => {
        /*||=====> Create and login a testing user <=====||*/
        const userMock = {
            first_name: 'testing',
            last_name: 'user',
            email: 'testingUser@gmail.com',
            age: 30,
            password: '123'
        }
        await requester.post('/api/session/register').send(userMock)
        const testingUser = await userModel.findOne({ email: 'testingUser@gmail.com' })
        userCartId = testingUser.cart._id
        let userLoginResponse = await requester.post('/api/session/login').send({ email: userMock.email, password: userMock.password })
        let userCookie = userLoginResponse.headers['set-cookie'][0]
        userSessionCookie = userCookie
        let mockProduct_1 = {
                category: "Test",
                title: "Test_1",
                description: "Test_1",
                price: 500,
                stock: 100,
                code: "Test_1",
        }
        const response = await requester.post("/api/products").set('Cookie', userSessionCookie).send(mockProduct_1)
        expect(response.statusCode).to.be.equal(403)
    })

    it('Creating a PRODUCT by an admin role must SUCCESS', async () => {
        /*||=====> Create and login mock admin <=====||*/
        const adminMock = {
            first_name: 'testing',
            last_name: 'admin',
            email: 'testingAdmin@coder.com',
            age: 30,
            password: 'adminCod3r123'
        }
        await requester.post('/api/session/register').send(adminMock)
        const testingAdmin = await userModel.findOne({ email: 'testingAdmin@coder.com' })
        adminCartId = testingAdmin.cart._id
        let adminLoginResponse = await requester.post('/api/session/login').send({ email: adminMock.email, password: adminMock.password })
        let adminCookie = adminLoginResponse.headers['set-cookie'][0]
        adminSessionCookie = adminCookie
        let mockProduct_2 = {
                category: "Test",
                title: "Test_2",
                description: "Test_2",
                price: 500,
                stock: 100,
                code: "Test_2",
                thumbnail: ['routeToImage'],
                status: false
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_2)
        expect(response.statusCode).to.be.equal(200)
    })

    it('Creating a PRODUCT without thumbnail field must SUCCESS', async () => {
        let mockProduct_3 = {
                category: "Test",
                title: "Test_3",
                description: "Test_3",
                price: 500,
                stock: 100,
                code: "Test_3",
                status: false
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_3)
        expect(response.statusCode).to.be.equal(200)
    })

    it('Creating a PRODUCT without status field must SUCCESS', async () => {
        let mockProduct_4 = {
                category: "Test",
                title: "Test_4",
                description: "Test_4",
                price: 500,
                stock: 100,
                code: "Test_4",
                thumbnail: ['routeToImage']
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_4)
        expect(response.statusCode).to.be.equal(200)
    })

    it('Creating a PRODUCT with a negative value in number field must FAIL', async () => {
        let mockProduct_5 = {
                category: "Test",
                title: "Test_5",
                description: "Test_5",
                price: -500,
                stock: 100,
                code: "Test_5"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_5)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT with string value type in number field must FAIL', async () => {
        let mockProduct_6 = {
                category: "Test",
                title: "Test_6",
                description: "Test_6",
                price: '500',
                stock: -100,
                code: "Test_6"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_6)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT with a negative value in stock field must FAIL', async () => {
        let mockProduct_7 = {
                category: "Test",
                title: "Test_7",
                description: "Test_7",
                price: 500,
                stock: -100,
                code: "Test_7"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_7)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT with string value type in number field must FAIL', async () => {
        let mockProduct_8 = {
                category: "Test",
                title: "Test_8",
                description: "Test_8",
                price: -500,
                stock: '100',
                code: "Test_8"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_8)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT without description field must FAIL', async () => {
        let mockProduct_8 = {
                category: "Test",
                title: "Test_8",
                price: 500,
                stock: 100,
                code: "Test_8"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_8)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT without title field must FAIL', async () => {
        let mockProduct_9 = {
                category: "Test",
                description: "Test_9",
                price: 500,
                stock: -100,
                code: "Test_9"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_9)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('Creating a PRODUCT without category field must FAIL', async () => {
        let mockProduct_10 = {
                title: "Test_10",
                description: "Test_10",
                price: 500,
                stock: -100,
                code: "Test_10"
        }
        const response = await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_10)
        expect(response.body.status).to.be.equal(3)
        expect(response.body.message).to.be.equal('An error occurred while processing your creation product request')
    })

    it('It must SUCCESSFULLY get a product by ID', async () => {
        let mockProduct_11 = {
            category: "Test",
            title: "Test_11",
            description: "Test_11",
            price: 500,
            stock: 100,
            code: "Test_11",
        }
        await requester.post("/api/products").set('Cookie', adminSessionCookie).send(mockProduct_11)
        let mockProduct = await productModel.findOne({ title: 'Test_11' })
        mockProduct_11_Id = mockProduct._id

        const response = await requester.get(`/api/products/${ mockProduct._id }`)
        expect(response.statusCode).to.be.equal(200)
    })

    it('It must SUCCESSFULLY update a product by an user with permission', async () => {
        let fieldToUpdate = {
            status: false
        }
        const response = await requester.put(`/api/products/${ mockProduct_11_Id }`).set('Cookie', adminSessionCookie).send(fieldToUpdate)
        expect(response.statusCode).to.be.equal(200)
    })

    it('It must SUCCESSFULLY delete a product by an user with permission', async () => {
        const response = await requester.delete(`/api/products/${ mockProduct_11_Id }`).set('Cookie', adminSessionCookie)
        expect(response.statusCode).to.be.equal(200)
    })
})