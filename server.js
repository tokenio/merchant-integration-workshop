// dev key 4qY7lqQw8NOl9gng0ZHgT4xdiDqxqoGVutuZwrUYQsI
const express = require('express');
const session = require('express-session');
const {TokenIO, Alias, TransferEndpoint} = require('token-io');

const Token = new TokenIO({env: 'sandbox', developerKey: '4qY7lqQw8NOl9gng0ZHgT4xdiDqxqoGVutuZwrUYQsI'});
let member;
const app = express();
app.use(
    express.json(),
    express.static(__dirname),
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 60000}
    })
);

app.post('/transfer', function (req, res) {
    req.session.csrf = Token.Util.generateNonce();
    const form = req.body;

    // set up the TokenTransferBuilder
    const tokenBuilder = member.createTransferTokenBuilder(form.amount, form.currency)
        .setDescription(form.description)
        .addDestination(TransferEndpoint.create(form.destination))
        .setToAlias(alias)
        .setToMemberId(member.memberId());
    // set up the TokenRequest
    const tokenRequest = Token.TokenRequest.create(tokenBuilder.build())
        .setRedirectUrl('http://localhost:3000/redeem');
    // store the token request
    member.storeTokenRequest(tokenRequest).then(function(request) {
        const requestId = request.id;
        const redirectUrl = Token.generateTokenRequestUrl(requestId, {a: 1}, req.session.csrf);
        res.status(200).send(redirectUrl);
    }).catch(console.log);
});

app.get('/redeem', function (req, res) {
    //get the token ID from the callback url
    Token.parseTokenRequestCallbackUrl(req.originalUrl, req.session.csrf).then(result => {
        var tokenId = result.tokenId;
        member.getToken(tokenId)
            .then(function (token) {
                //Redeem the token to move the funds
                member.redeemToken(token)
                    .then(function (transfer) {
                        console.log('\n Redeem Token Response:', transfer);
                        res.status(200).send('Success! Redeemed transfer ' + transfer.id);
                    });
            });
    })
});

const alias = Alias.create({
    type: 'EMAIL',
    value: `asdfasde${Math.random()}+noverify@example.com`,
});
Token.createBusinessMember(alias, Token.MemoryCryptoEngine).then(m => {
    member = m;
    app.listen(3000, function () {
        console.log('Sample merchant listening on port 3000!')
    });
});
