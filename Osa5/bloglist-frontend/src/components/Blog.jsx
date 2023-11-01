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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenAll = { display: showAllInfo ? '' : 'none' }
  const showToUser = {
    display: (user.username === blog.user.username) ? '' : 'none',
    backgroundColor: 'lightblue'
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blogName'>
        {blog.title} by {blog.author}
        <button onClick={toggleShowAll} className='displayButton'>{buttonLabel}</button>
      </div>
      <div style={showWhenAll} className='additionalInfo'>
        {blog.url}
        <br/>
        likes: {blog.likes}
        <button onClick={addLike} className='likeButton'>like</button>
        <br/>
        {blog.user.name}
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