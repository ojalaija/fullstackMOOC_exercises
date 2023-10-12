import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [showAllInfo, setShowAllInfo] = useState(false)

  const toggleShowAll = () => {
    setShowAllInfo(!showAllInfo)
  }

  const buttonLabel = (
    showAllInfo ? 'hide' : 'view'
  )

  const showUserName = () => {
    if (blog.user !== undefined) {
      return (
        <div>
          {blog.user.name}
        </div>)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenAll = { display: showAllInfo ? '' : 'none' }
  const showToUser = {
    display: (blog.user !== undefined && user.username === blog.user.username) ? '' : 'none',
    backgroundColor: 'lightblue'
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowAll}>{buttonLabel}</button>
      </div>
      <div style={showWhenAll}>
        {blog.url}
        <br/>
        likes: {blog.likes}
        <button onClick={addLike}>like</button>
        <br/>
        {showUserName()}
        <br/>
        <button style={showToUser} onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog