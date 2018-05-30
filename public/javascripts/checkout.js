console.log('inside checkout.js...');

/*
// Create a Stripe client.
var stripe = Stripe('pk_test_G48XW0NOk13xaDsUERQizLeI');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {

  console.log('here');
  console.log('card-number: ', $('#card-number').val());

  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      console.log('...there was an error right after submit');
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      console.log('sending token: ', result.token);
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}
*/

//---------------------------------------------------------------------------
/*
var stripe = Stripe('pk_test_G48XW0NOk13xaDsUERQizLeI');
var elements = stripe.elements();

//Stripe.setPublishableKey('pk_test_G48XW0NOk13xaDsUERQizLeI');


var $form = $('#payment-form');

$form.submit(function (event) {
    console.log('here');
    console.log('card-number: ', $('#card-number').val());

    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true); // user can't submit multiple times

    console.log('here2');

    //stripe.card.createToken({
    stripe.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler);

    return false;
});

function stripeResponseHandler(status, response) {
    console.log('stripeResponseHandler called...');

    // Grab the form:
    var form = document.getElementById('payment-form');

    if (response.error) { // Problem!
        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!
        console.log('response.id (token): ', response.id);
        // Get the token ID:
        var token = response.id;
        
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();
    }
}
*/


/*
// Create a token when the form is submitted
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
    console.log('callback called...');

    //$('#charge-error').addClass('hidden');
    //$form.find('button').prop('disabled', true); // user can't submit multiple times

    e.preventDefault();

    //var promise = stripe.createToken(card, stripeResponseHandler);
    //promise.then(function(result) {
      // result.token is the card token.
    //});

    stripe.createToken('bank_account', {
        country: 'US',
        currency: 'usd',
        routing_number: '110000000',
        account_number: '000123456789',
        account_holder_name: 'Jenny Rosen',
        account_holder_type: 'individual',
      }, stripeResponseHandler);


    //stripe.card.createToken(form, stripeResponseHandler);
});
*/