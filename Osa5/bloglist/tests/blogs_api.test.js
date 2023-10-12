const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest.agent(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there are initially some blogs saved on the list', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(helper.testUser.password, 10)
    const user = new User({ username: helper.testUser.username, name: helper.testUser.name, passwordHash })

    await user.save()

    const response = await api.post('/api/login').send({ username: helper.testUser.username, password: helper.testUser.password })
    api.auth(response.body.token, { type: 'bearer' })

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await Blog.updateMany({}, { user: user._id })
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
    test('succeeds if the data is valid and is done by logged in user', async () => {
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

    test('fails with status code 401 if there is no token', async () => {
      await api.auth(null)
      const newBlog = {
        title: 'Failing blog',
        author: 'Failing Author',
        url: 'www.notrealgblogsowillnotadd.com',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
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

describe('when there is initially one user at the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('verysekret', 10)
    const user = new User({ username: 'root', name: 'Super User', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Superior User',
      password: 'etarvaakaan',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd= await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username:'arvia',
      name: 'Arvi Arvailija',
      password: 'salaisuus'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if the username is too short', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username:'ba',
      name: 'Barbara Mattel',
      password: 'barbie'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode if username is missing', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: '',
      name: 'Just Ken',
      password: 'kenough'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Path `username` is required')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode if password is too short', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'vader',
      name: 'Darth Vader',
      password: 'kh'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing or under 3 characters')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode if password is missing', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'babyyoda',
      name: 'Grogu',
      password: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing or under 3 characters')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})