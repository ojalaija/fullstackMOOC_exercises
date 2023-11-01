import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)

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
            id='title-input'
          />
        </div>
        <div>
          author:
          <input
            value={newBlog.author}
            onChange={handleBlogFormChange('author')}
            id='author-input'
          />
        </div>
        <div>
          url:
          <input
            value={newBlog.url}
            onChange={handleBlogFormChange('url')}
            id='url-input'
          />
        </div>
        <button type="submit" className='submitButton'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm