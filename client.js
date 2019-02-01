function createRedirectButton() {
    // create TokenPopupController to handle Popup messages
    tokenController = window.Token.createRedirectController();

    // get button placeholder element
    var element = document.getElementById('token-button');

    // create the button
    button = window.Token.createTokenButton(element, {
        label: "Token Quick Checkout",
    });

    // bind the Token Button to the Redirect Controller when ready
    tokenController.bindButtonClick(button, function(action) {
        // Each time the button is clicked, a new tokenRequestUrl is created
        getTokenRequestUrl(function(tokenRequestUrl) {
            // Initialize popup using the tokenRequestUrl
            action(tokenRequestUrl);
        });
    });
    // enable button after binding
    button.enable();
}

function getTokenRequestUrl(done) {
    var XHR = new XMLHttpRequest();

    //set up the transfer request
    XHR.open('POST', 'http://localhost:3000/transfer', true);

    XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    var data = JSON.stringify({
        merchantId: 'Merchant 123',
        amount: 3000 * document.getElementById('merchant-quantity').value,
        currency: 'JPY',
        description: 'Book Purchase',
        destination: {account: {fasterPayments: {sortCode: "123456", accountNumber: "12345678"}}}
    });

    console.log('data: ', data);

    // Define what happens on successful data submission
    XHR.addEventListener("load", function(event) {
        // execute callback once response is received
        if (event.target.status === 200) {
            done(event.target.response);
        }
    });

    // Send the data; HTTP headers are set automatically
    XHR.send(data);
}

createRedirectButton();