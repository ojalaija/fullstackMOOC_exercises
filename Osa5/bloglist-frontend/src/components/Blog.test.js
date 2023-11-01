import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockLike = jest.fn()
  const mockRemove = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Rendering things is important',
      author: 'Render Allday',
      url: 'www.renderingallthethingsalltheday.com',
      likes: 2,
      user: {
        username: 'deer',
        name: 'Rudolf Red'
      }
    }

    const user = {
      username: 'santa'
    }

    container = render(<Blog
      blog={blog}
      user={user}
      addLike={mockLike}
      removeBlog={mockRemove}
    />
    ).container
  })

  test('renders title and author, but additional info is not visible', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Rendering things is important by Render Allday'
    )
  })

  test('additional info is not shown initially', () => {
    const additional = container.querySelector('.additionalInfo')
    expect(additional).toHaveStyle('display: none')
  })

  test('clicking the view button displays url, likes and user', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.displayButton')
    await user.click(button)

    const additional = container.querySelector('.additionalInfo')
    expect(additional).not.toHaveStyle('display: none')
  })

  test('clicking like-button calls like-function twice', async() => {
    const user = userEvent.setup()
    const viewButton = container.querySelector('.displayButton')
    await user.click(viewButton)

    const likeButton = container.querySelector('.likeButton')
    await user.dblClick(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})