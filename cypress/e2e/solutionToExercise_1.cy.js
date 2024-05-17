describe('Automation Exercise', () => {
  const url = 'https://www.automationexercise.com/';

  it('Automate Login, fetch items and sort, add to cart, checkout, and order items confirmation', () => {
    // Navigate to the url
    cy.visit(url);
    cy.get('a[href="/login"]').click();
    cy.url().should('includes', '/login')


    // login with the provided credentials
    cy.get('input[data-qa="login-email"]').type('qat@mailinator.com');
    cy.get('input[data-qa="login-password"]').type('123456');
    cy.get('button[data-qa="login-button"]').click();


    // Fetch and sort the features items
    cy.get('.features_items .productinfo.text-center')
      .then(items => {
        const products = [];
        items.each((index, item) => {
          const label = Cypress.$(item).find('p').text();
          let priceString = Cypress.$(item).find('h2').text();
          
          // only interested in numeric characters located at index 1
          priceString = priceString.split(" ")[1];
          
          // Parse the price as Number object so that it can be sorted
          const price = parseInt(priceString);
          
          // Push the product with label and price to the declared products array above
          products.push({ label, price });
        });
        return products;
      })
      .then(products => {
        // Sort products by price in ascending order
        products.sort((a, b) => a.price - b.price);
        
        // Log sorted products to the console
        console.log('List of the Sorted Products');
        console.log(products);
      });


    // Navigate to women's top section, then add fancy green  and summer white top to the cart
    cy.get('a[href="#Women"]').click();
    cy.get('a[href="/category_products/2"]').should('be.visible').click();
    
    // Add Fancy Green Top to cart
    cy.contains('.productinfo.text-center', 'Fancy Green Top')
      .within(() => {
        cy.get('.btn.btn-default.add-to-cart').click();
      });
    cy.get('.btn.btn-success.close-modal.btn-block').click();

    // Add Summer White Top to cart
    cy.contains('.productinfo.text-center', 'Summer White Top')
      .within(() => {
        cy.get('.btn.btn-default.add-to-cart').click();
      });
    
    // Click the View Cart button in the modal popup
    cy.get('.modal-body')
      .within(() => { 
          cy.get('a[href="/view_cart"]').should('be.visible').click();
    });
    
    // Checkout, add comment  and proceed to payment page
    cy.get('.btn.btn-default.check_out').click();
    cy.get('#ordermsg .form-control').type('Order placed.');
    cy.get('#ordermsg .form-control').should('have.value', 'Order placed.');
    cy.get('a[href="/payment"]').click();

    // Enter card details and make payment
    cy.get('input[data-qa="name-on-card"]').type('Test Card');
    cy.get('input[data-qa="card-number"]').type('4100000000000000');
    cy.get('input[data-qa="cvc"]').type('123');
    cy.get('input[data-qa="expiry-month"]').type('01');
    cy.get('input[data-qa="expiry-year"]').type('1900');
    cy.get('button[data-qa="pay-button"]').click();

    // Confirm that the order has been placed
    cy.get('h2[data-qa="order-placed"]')
      .should('be.visible')
      .and('have.text', 'Order Placed!');
  });
});
