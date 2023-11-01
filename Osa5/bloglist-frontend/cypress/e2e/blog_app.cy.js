describe('Blog App', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const userFirst = {
      name: 'Maija Mallikas',
      username: 'mmallikas',
      password: 'salaisuus'
    }
    cy.createUser({ name: 'Maija Mallikas', username: 'mmallikas', password: 'salaisuus'})
    cy.createUser({ name: 'Erkki Esimerkki', username: 'emerkki', password: 'salaisempi'})

    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#loginForm').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mmallikas')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()

      cy.contains('Maija Mallikas logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mmallikas')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain','Maija Mallikas logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mmallikas', password: 'salaisuus' })
    })

    it('a blog can be created', function() {
      cy.contains('add new blog').click()
      cy.get('#title-input').type('A test blog about testing')
      cy.get('#author-input').type('Avid Tester')
      cy.get('#url-input').type('www.testingtestsalldaylongohyeah.com')
      cy.get('.submitButton').click()

      cy.get('#blogList').should('contain','A test blog about testing')
    })

    describe('And blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'First Blog', author: 'First Author', url: 'www.firstblog.com' })
        cy.createBlog({ title: 'Second Blog', author: 'Second Author', url: 'www.secondblog.com' })
        cy.createBlog({ title: 'Third Blog', author: 'Third Author', url: 'www.thirdblog.com' })
      })

      it('a blog can viewed', function() {
        cy.contains('Third Blog').contains('view').click()
        cy.contains('Third Blog').parent().contains('like').click()
        cy.contains('Third Blog').parent().should('contain', 'likes: 1')
      })

      it('a blog can be removed by the creator', function() {
        cy.contains('First Blog').contains('view').click()
        cy.contains('First Blog').parent().contains('remove').click()
        cy.get('#blogList').should('not.contain', 'First Blog')
      })

      it('only the creator sees remove-button', function() {
        cy.contains('logout').click()
        cy.login({ username: 'emerkki', password: 'salaisempi' })

        cy.contains('First Blog').contains('view').click()
        cy.contains('First Blog').parent().contains('remove').should('not.be.visible')
      })

      it.only('the blogs are organized by most likes', function() {
        cy.get('.displayButton').click({ multiple: true })
        cy.contains('Third Blog').parent().contains('like').as('most')
        cy.get('@most').click()
        cy.get('@most').click()
        cy.get('@most').click()

        cy.contains('First Blog').parent().contains('like').as('secondMost')
        cy.get('@secondMost').click()
        cy.get('@secondMost').click()

        cy.get('.blog').eq(0).should('contain', 'Third Blog')
          .and('contain', 'likes: 3')
        cy.get('.blog').eq(1).should('contain', 'First Blog')
          .and('contain', 'likes: 2')
      })
    })
  })
})