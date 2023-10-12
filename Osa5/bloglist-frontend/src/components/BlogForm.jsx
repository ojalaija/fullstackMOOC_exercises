import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  const handleBlogFormChange = (field) => {
    return ({ target }) =>
      setNewBlog(newBlog => ({
        ...newBlog,
        ...{ [field]: target.value }
      }))
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newBlog.title}
            onChange={handleBlogFormChange('title')}
          />
        </div>
        <div>
          author:
          <input
            value={newBlog.author}
            onChange={handleBlogFormChange('author')}
          />
        </div>
        <div>
          url:
          <input
            value={newBlog.url}
            onChange={handleBlogFormChange('url')}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm