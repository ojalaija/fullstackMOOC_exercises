import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'
import './index.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('confirm')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const notificationMessage = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
      setNotificationType('confirm')
    }, 5000)
  }

  const errorMessage = (error) => {
    setNotificationType('error')
    notificationMessage(error.response.data.error)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationType('error')
      notificationMessage('wrong credentials')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(blogObject)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      notificationMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (error) {
      errorMessage(error)
    }
  }

  const addLikeTo = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const likedBlog = { ...blog, likes: (blog.likes+1) }

    try {
      await blogService.update(id, likedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : likedBlog ))
    } catch (error) {
      errorMessage(error)
    }
  }

  const deleteBlog = async (id, title) => {
    if (window.confirm(`Delete blog '${title}'`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        notificationMessage(`Blog '${title}' deleted`)
      } catch (error) {
        errorMessage(error)
      }
    }
  }

  const sortedBlogs = () => {
    const sorted = blogs.sort((a,b) => b.likes - a.likes)

    return sorted.map(blog =>
      <Blog key={blog.id} blog={blog} addLike={() => addLikeTo(blog.id)} removeBlog={() => deleteBlog(blog.id, blog.title)} user={user}/>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel="add new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <form onSubmit={handleLogin} id='loginForm'>
          <div>
              username
            <input
              type="text"
              value={username}
              name="username"
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
              password
            <input
              type="password"
              value={password}
              name="password"
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <div>
        {blogForm()}
      </div>
      <div id='blogList'>
        {sortedBlogs()}
      </div>
    </div>
  )
}

export default App