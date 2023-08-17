const request = require("supertest")
const app = require("../app")
const Category = require("../models/Category")
require("../models")

const URL_PRODUCTS = '/api/v1/products'
const URL_USER_LOGIN = '/api/v1/users/login'
let TOKEN
let product
let category
let productId

beforeAll(async () => {
    const user = {
        email: "elkin@gmail.com",
        password: "1234elkin"
    }
    
    const res = await request(app)
        .post(URL_USER_LOGIN)
        .send(user)

    TOKEN = res.body.token


    const categoryBody = {
        name: "Smart TV"
    }

    category = await Category.create(categoryBody)

    product = {
        title: "Smart Tv LG",
        description: "lorem10",
        price: 200.45,
        categoryId: category.id
    }
})

test("POST -> 'URL_PRODUCTS', should return status code 201 and res.body.title = product.title", async () => {
    const res = await request(app)
        .post(URL_PRODUCTS)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)
    
    productId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
})

test("GET -> 'URL_PRODUCTS', should resturn status code 200 and res.body.legnth = 1", async () => {

    const res = await request(app)
        .get(URL_PRODUCTS)
  
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1) 
})

test("GET ONE -> 'URL_PRODUCTS/:id', should return status code 200 and res.body.title = product.title", async () => {
    const res = await request(app)
        .get(`${URL_PRODUCTS}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
})

test("PUT -> 'URL_PRODUCTS/:id', should return status code 200 and res.body.title = productUpdate.title", async () => {
    const productUpdate = {
        title: "Samsung",
    }

    const res = await request(app)
        .put(`${URL_PRODUCTS}/${productId}`)
        .send(productUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(productUpdate.title)
})

test("DELETE -> 'URL_PRODUCTS/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_PRODUCTS}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

    await category.destroy()
})