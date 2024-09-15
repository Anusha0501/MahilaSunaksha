const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');

const app = express();

// Environment variables for Auth0 (Replace these with your actual Auth0 credentials)
const AUTH0_DOMAIN = 'dev-gfixxzizoa7ce1gu.us.auth0.com';
const AUTH0_CLIENT_ID = 'YOUR_AUTH0_CLIENT_ID'; // Replace with your Auth0 client ID
const AUTH0_CLIENT_SECRET = 'YOUR_AUTH0_CLIENT_SECRET'; // Replace with your Auth0 client secret
const AUTH0_CALLBACK_URL = 'http://localhost:3000/callback';
const AUTH0_AUDIENCE = 'https://dev-gfixxzizoa7ce1gu.us.auth0.com/api/v2/'; // Your Auth0 Management API audience

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and configure Auth0 strategy
passport.use(new Auth0Strategy({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    callbackURL: AUTH0_CALLBACK_URL,
    audience: AUTH0_AUDIENCE,
    scope: 'openid profile email'
}, (accessToken, refreshToken, extraParams, profile, done) => {
    // You can save the access token for further use in your app if needed
    return done(null, profile);
}));

// Serialize and deserialize user for the session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><a href="/login">Login with Auth0</a>');
});

// Route to trigger Auth0 login
app.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/');
});

// Auth0 callback URL route
app.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard');
});

// Dashboard route (Protected route)
app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`<h1>Welcome, ${req.user.displayName || req.user.email}</h1><a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
