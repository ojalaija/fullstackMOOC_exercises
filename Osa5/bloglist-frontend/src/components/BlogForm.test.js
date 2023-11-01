import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlockForm /> calls addBlog-function with correct data', async () => {
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const submitButton = container.querySelector('.submitButton')

  await userEvent.type(titleInput, 'Test Blog for Test')
  await userEvent.type(authorInput, 'Test Writer')
  await userEvent.type(urlInput, 'www.testurlofortestblog.com')
  await userEvent.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog for Test',
    author: 'Test Writer',
    url: 'www.testurlofortestblog.com'
  })
})