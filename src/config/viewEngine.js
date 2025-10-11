const path = require('path')
const express = require('express')

// import path from 'path';
// import express from 'express';

const configViewEngine = (app) => {
    app.set('views', path.join('./src', 'views'));  // chỉ định thư mục chứa file ejs
    app.set('view engine', 'ejs')

    // cònfig static files (css, js, images)
    app.use(express.static(path.join('./src', 'public')));
}

module.exports = configViewEngine;

// export default configViewEngine;

