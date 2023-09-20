const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there are initially some blogs saved on the list', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs are returned and are returned to json', async () => {
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

  describe('adding a new blog to the list', () => {
    test('succeeds if the data is valid', async () => {
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

    test('succeeds even if the "likes" is empty, giving it value 0', async () => {
      const noLikesBlog = {
        title: 'A Beginner\'s Guide to JavaScript async/await, with Examples',
        author: 'James Hibbard',
        url: 'https://www.sitepoint.com/javascript-async-await/',
      }

      const response = await api
        .post('/api/blogs')
        .send(noLikesBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
    })

    test('fails if the "title" is empty, returning status code 400', async () => {
      const noTitleBlog = {
        author: 'James Hibbard',
        url: 'https://www.sitepoint.com/javascript-async-await/',
      }

      await api
        .post('/api/blogs')
        .send(noTitleBlog)
        .expect(400)
    })

    test('fails if the "url" is empty, returning status code 400', async () => {
      const noUrlBlog = {
        title: 'A Beginner\'s Guide to JavaScript async/await, with Examples',
        author: 'James Hibbard',
      }

      await api
        .post('/api/blogs')
        .send(noUrlBlog)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length -1
      )
    })

    test('fails with status code 400 if the id is invalid', async() => {
      const blogsAtStart = await helper.blogsInDb()
      const fakeIDToDelete = '123asdaksdj123'

      await api
        .delete(`/api/blogs/${fakeIDToDelete}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid data and id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: (blogToUpdate.likes + 1)
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const changedBlog = blogsAtEnd[0]

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      expect(changedBlog.likes).toEqual(blogToUpdate.likes + 1)
    })

    test('fails if the data is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        title: blogToUpdate.title,
        author: '',
        url: blogToUpdate.url,
        likes: (blogToUpdate.likes + 1)
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})