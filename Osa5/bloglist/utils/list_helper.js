const _ = require('lodash')

const dummy = (blogs) => {
  return blogs.length === 0
    ? 1
    : 1
}

const totalLikes = (blogs) => {
  return _(blogs).sumBy('likes')
}

const favoriteBlog = (blogs) => {
  const favorite = _(blogs).maxBy('likes')
  return favorite
}

const mostBlogs = (bloglist) => {
  const authorList = _(bloglist).groupBy('author')
    .map((list, author) => ({
      author: author,
      blogs: list.length
    }))
    .value()

  const mostProlific = _(authorList).maxBy('blogs')

  return mostProlific
}

const mostLikes = (bloglist) => {
  const authorList = _(bloglist).groupBy('author')
    .map((list, author) => ({
      author: author,
      likes: _(list).sumBy('likes')
    }))
    .value()

  const mostLiked = _.maxBy(authorList, 'likes')

  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}