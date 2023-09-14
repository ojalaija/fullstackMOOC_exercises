const dummy = (blogs) => {
  return blogs.length === 0
    ? 1
    : 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = (blogs.length === 0)
    ? 'no blogs yet'
    : blogs.reduce((previous, current) => (previous.likes > current.likes) ? previous : current, 0)
  return favorite
}

const mostBlogs = (bloglist) => {
  const mostProlific = (bloglist.length === 0)
    ? 'no blogs yet'
    :  Object.values(bloglist.reduce((authors, { author }) => {
      authors[author] = authors[author] || { author, blogs: 0 }
      authors[author].blogs++
      return authors
    }, Object.create(null)))
      .reduce((previous, current) => (previous.blogs > current.blogs) ? previous : current)

  return mostProlific
}

const mostLikes = (bloglist) => {
  const mostLiked = (bloglist.length === 0)
    ? 'no blogs yet'
    :  Object.values(bloglist.reduce((authors, blog) => {
      authors[blog.author] = authors[blog.author] || { author: blog.author, likes: 0 }
      authors[blog.author].likes += blog.likes
      return authors
    }, Object.create(null)))
      .reduce((previous, current) => (previous.likes > current.likes) ? previous : current)

  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}