/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

// child process for python
const { spawn } = require('child_process');

// Needed for EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));


// main landing page
app.get('/', function(req, res) {
    res.render('pages/index');
});


//about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

//about page
app.get('/instructions', function(req, res) {
    res.render('pages/instructions');
});

//about page
app.get('/login', function(req, res) {
    res.render('pages/login');
});

//about page
app.get('/profile', function(req, res) {
    res.render('pages/profile');
});

//about page
app.get('/results', function(req, res) {
    res.render('pages/results');
});

//about page
app.get('/roadmap', function(req, res) {
    res.render('pages/roadmap');
});

//about page
app.get('/signup', function(req, res) {
    res.render('pages/signup');
});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);