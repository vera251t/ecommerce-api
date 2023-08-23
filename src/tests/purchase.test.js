const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
require("../models")

const URL_LOGIN = '/api/v1/users'
const URL_PURCHASE = '/api/v1/purchase'

let TOKEN
let userId
let productBody
let product
let bodyCart

beforeAll(async () => {
    //login
    const user = {
        email: "elkin@gmail.com",
        password: "1234elkin"
    }

    const res = await request(app)
        .post(`${URL_LOGIN}/login`)
        .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id

    //product
    productBody = {
        title: "product1",
        description: "lorem10",
        price: 50
    }

    product = await Product.create(productBody)

    //cart
    bodyCart = {
        quantity: 2,
        productId: product.id
    }

    await request(app)
        .post('/api/v1/cart')
        .send(bodyCart)
        .set('Authorization', `Bearer ${TOKEN}`)
})

test("POST -> 'URL_PURCHASE', should return status code 201 and res.body.quantity === bodyCart.quantity", async () => {
    const res = await request(app)
        .post(URL_PURCHASE)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(201)
    expect(res.body[0].quantity).toBe(bodyCart.quantity)
})

test("GET -> 'URL_PURCHASE', should return status code 200 and res.body.length === 1", async () => {
    const res = await request(app)
        .get(URL_PURCHASE)
        .set('Authorization', `Bearer ${TOKEN}`)
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].userId).toBe(userId)
    expect(res.body[0].product).toBeDefined()
    expect(res.body[0].product.id).toBe(product.id)
    expect(res.body[0].product.productImgs).toBeDefined()
    expect(res.body[0].product.productImgs).toHaveLength(0)

    await product.destroy()
})