import chai from 'chai'
import supertest from 'supertest'
import app from './../src/app.js'
import productModel from './../src/dao/persistence/mongodb/models/products-model.js'
import cartModel from './../src/dao/persistence/mongodb/models/carts-model.js'
import userModel from './../src/dao/persistence/mongodb/models/user-model.js'
import ticketModel from './../src/dao/persistence/mongodb/models/ticket-model.js'

const expect = chai.expect
const requester = supertest(app)

describe('Sessions module testing', () => {
    let cartUserMockId
    let userEmail
    let userPassword
    let userSessionCookie
    let cartAdminMockId
    let productMockId_1
    let productMockId_2
    let productMockId_3
    let emptyCartId

    before( async function () {
        /*||=====> Register a testing USER <=====||*/
        const userMock = {
            first_name: 'testing',
            last_name: 'user',
            email: 'testingUser@gmail.com',
            age: 30,
            password: '123'
        }
        await requester.post('/api/session/register').send(userMock)
        const newUser = await userModel.findOne({ email: 'testingUser@gmail.com' })
        cartUserMockId = newUser.cart._id
        userEmail = userMock.email
        userPassword = userMock.password

        /*||=====> Register a testing ADMIN <=====||*/
        const adminMock = {
            first_name: 'testing',
            last_name: 'admin',
            email: 'testingAdmin@coder.com',
            age: 30,
            password: 'adminCod3r123'
        }
        await requester.post('/api/session/register').send(adminMock)
        const newAdmin = await userModel.findOne({ email: 'testingAdmin@coder.com' })
        cartAdminMockId = newAdmin.cart._id

        /*||=====> Create three mock products by an ADMIN <=====||*/
        let adminLoginResponse = await requester.post('/api/session/login').send({ email: adminMock.email, password: adminMock.password })
        let adminCookie = adminLoginResponse.headers['set-cookie'][0]
        adminSessionCookie = adminCookie
        let mockProduct_1 = {
            category: "Test",
            title: "Test_1",
            description: "Test_1",
            price: 500,
            stock: 100,
            code: "Test_1",
        }
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
        let mockProduct_3 = {
            category: "Test",
            title: "Test_3",
            description: "Test_3",
            price: 500,
            stock: 100,
            code: "Test_3",
            thumbnail: ['routeToImage'],
            status: false
    }
        const creatingProductResponse_1 = await requester.post("/api/products").set('Cookie', adminCookie).send(mockProduct_1)
        const creatingProductResponse_2 = await requester.post("/api/products").set('Cookie', adminCookie).send(mockProduct_2)
        const creatingProductResponse_3 = await requester.post("/api/products").set('Cookie', adminCookie).send(mockProduct_3)
        productMockId_1 = creatingProductResponse_1.body.payload._id
        productMockId_2 = creatingProductResponse_2.body.payload._id
        productMockId_3 = creatingProductResponse_3.body.payload._id
    })

    beforeEach( async function() {
        this.timeout(10000)
    })

    after(async () => {
        await userModel.findOneAndDelete({ email: userEmail })
        await userModel.findOneAndDelete({ email: 'testingAdmin@coder.com' })
        await productModel.deleteMany({ category: 'Test' })
        await cartModel.findByIdAndDelete({ _id: cartUserMockId })
        await cartModel.findByIdAndDelete({ _id: cartAdminMockId })
        await cartModel.findByIdAndDelete({ _id: emptyCartId })
        await ticketModel.deleteMany({ purchaser: userEmail })
        process.exit()
    })

    it('It must SUCCESSFULLY create a CART with an empty array of products', async () => {
        const response = await requester.post('/api/carts')
        emptyCartId = response.body.payload._id
        const cartLength = (response.body.payload.products).length
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(Array.isArray(response.body.payload.products)).to.deep.equal(true)
        expect(cartLength).to.be.equal(0)
    })

    it('It must SUCCESSFULLY get every CART created', async () => {
        const response = await requester.get('/api/carts')
        const cartLength = (response.body.payload).length
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(Array.isArray(response.body.payload)).to.deep.equal(true)
        expect(cartLength).to.be.greaterThanOrEqual(2)
    })

    it('It must SUCCESSFULLY get a CART by its ID', async () => {
        const response = await requester.get(`/api/carts/${ cartUserMockId }`)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
    })

    it('It must SUCCESSFULLY full update a CART by its ID', async () => {
        const productsToCart = [
            {
                _id: productMockId_1,
                quantity: 1
            },
            {
                _id: productMockId_2,
                quantity: 1
            }
        ]
        const response = await requester.put(`/api/carts/${ cartUserMockId }`).send(productsToCart)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
    })

    it('If a CART already has a product that a user is trying to add, then its quantities will be added, if not, the new product is added', async () => {
        const productsToCart = [
            {
                _id: productMockId_1,
                quantity: 1
            },
            {
                _id: productMockId_3,
                quantity: 1
            }
        ]
        const response = await requester.put(`/api/carts/${ cartUserMockId }`).send(productsToCart)
        let cart = await cartModel.findById(cartUserMockId)
        expect(response.statusCode).to.be.equal(200)
        expect(cart.products[0].quantity).to.be.equal(2)
        expect(cart.products[1].quantity).to.be.equal(1)
        expect(cart.products[2].quantity).to.be.equal(1)
    })

    it('It must SUCCESSFULLY delete a product in a CART by its IDs', async () => {
        const response = await requester.delete(`/api/carts/${ cartUserMockId }/product/${ productMockId_3 }`)
        let cart = await cartModel.findById(cartUserMockId)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(cart.products[2]).to.be.equal(undefined)
    })

    it('It must SUCCESSFULLY add a product in a CART by its IDs', async () => {
        let user = await userModel.findOne({ email: 'testingUser@gmail.com' })
        let userLoginResponse = await requester.post('/api/session/login').send({ email: user.email, password: userPassword })
        let userCookie = userLoginResponse.headers['set-cookie'][0]
        userSessionCookie = userCookie
        const response = await requester.post(`/api/carts/${ cartUserMockId }/product/${ productMockId_3 }`).set('Cookie', userCookie)
        let cart = await cartModel.findById(cartUserMockId)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(cart.products[2].quantity).to.be.equal(1)
    })

    it('It must SUCCESSFULLY update (does NOT add) a product quantity in a CART by its IDs', async () => {
        const newQuantity = {
            quantity: 20
        }
        const response = await requester.put(`/api/carts/${ cartUserMockId }/product/${ productMockId_3 }`).send(newQuantity)
        let cart = await cartModel.findById(cartUserMockId)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(cart.products[2].quantity).to.be.equal(20)
    })

    it('It must SUCCESSFULLY create a ticket from a cart ID and remove those products that are in stock', async () => {
        const response = await requester.post(`/api/carts/${ cartUserMockId }/purchase`).set('Cookie', userSessionCookie)
        let cart = await cartModel.findById(cartUserMockId)
        const cartLength = (cart.products).length
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(Array.isArray(cart.products)).to.deep.equal(true)
        expect(cartLength).to.be.equal(0)
    })
    
    it('It must SUCCESSFULLY delete every product in a CART by its IDs. Products array in cart should be equal to 0.', async () => {
        const productsToCart = [
            {
                _id: productMockId_1,
                quantity: 1
            },
            {
                _id: productMockId_2,
                quantity: 1
            }
        ]
        await requester.put(`/api/carts/${ cartUserMockId }`).send(productsToCart)
        const response = await requester.delete(`/api/carts/${ cartUserMockId }`)
        let cart = await cartModel.findById(cartUserMockId)
        const cartLength = (cart.products).length
        expect(response.statusCode).to.be.equal(200)
        expect(response.body.status).to.be.equal("success")
        expect(Array.isArray(cart.products)).to.deep.equal(true)
        expect(cartLength).to.be.equal(0)
    })
})