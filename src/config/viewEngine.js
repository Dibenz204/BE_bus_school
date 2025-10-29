const path = require('path')
const express = require('express')

// import path from 'path';
// import express from 'express';

const configViewEngine = (app) => {
    // Use __dirname so paths work regardless of current working directory
    app.set('views', path.join(__dirname, '..', 'views'));  // chỉ định thư mục chứa file ejs
    app.set('view engine', 'ejs');

    // config static files (css, js, images)
    app.use(express.static(path.join(__dirname, '..', 'public')));
}

module.exports = configViewEngine;

// export default configViewEngine;

