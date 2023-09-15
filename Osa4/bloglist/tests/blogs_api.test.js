const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned and are json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('returning blog identifier is "id"', async () => {
  const response = await api.get('/api/blogs')
  response.body.map(r => expect(r.id).toBeDefined())
})

test('a new blog can be added and its title is right', async () => {
  const newBlog = {
    title: 'Building Great User Experiences with Concurrent Mode and Suspense',
    author: 'Joseph Savona',
    url: 'https://legacy.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'Building Great User Experiences with Concurrent Mode and Suspense'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})