describe('Automation Exercise Test Restful-booker Api Endpoint', () => {
  const baseUrl = 'https://restful-booker.herokuapp.com';
  let bookingId;
  let authToken;

  it('Create a new booking', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/booking`,
      body: {
        firstname: "Abdulsamad",
        lastname: "Bello",
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-05-16",
          checkout: "2024-05-20"
        },
        additionalneeds: "Breakfast"
      }
    }).then(response => {
      expect(response.status).to.eq(200);
      bookingId = response.body.bookingid;
    });

    cy.log('New booking has been created successfully');
  });

  it('Retrieve the created booking', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/booking/${bookingId}`
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.firstname).to.eq("Abdulsamad");
      expect(response.body.lastname).to.eq("Bello");
    });

    cy.log('The just created booking has been successfully retrieved')
  });


  it('Get the Auth token needed to perform update', () => { 
    cy.request({ 
      method: 'POST',
      url: `${baseUrl}/auth`,
      body: {
        username: "admin",
        password: "password123"
      } 
    }).then((response) => { 
      expect(response.status).to.eq(200);
      authToken = response.body.token;
    });

    cy.log('Got the Authorization token to perform update');
  });

  
  it('Update the created booking', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/booking/${bookingId}`,
      body: {
        firstname: "Bello",
        lastname: "Abdulsamad",
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-05-16",
          checkout: "2024-05-25"
        },
        additionalneeds: "WiFi"
      },
      headers: { 
        "cookie": `token=${authToken}`
      } 
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.additionalneeds).to.eq("WiFi");
      expect(response.body.bookingdates.checkout).to.eq("2024-05-25");
    });

    cy.log("The booking has been successfully updated")
  });
});

