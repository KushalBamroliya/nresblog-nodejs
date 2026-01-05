const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const minifyHTML = require('express-minify-html-terser');
const compress = require('compression');

dotenv.config();
const app = express();
const port = 3000;

// database connection
mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Database Connected'));

// all middleware 
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, "public")));
app.set('layout', 'layout');

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(expressLayouts);
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifierOptions: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
    removeOptionalTags: true,
    removeEmptyElements: true,
    removeScriptTypeAttributes: true,
    collapseBooleanAttributes: true
  },
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
    removeOptionalTags: true,
    removeEmptyElements: true,
    removeScriptTypeAttributes: true,
    collapseBooleanAttributes: true
  }  
}))
app.use(compress());

// routes
app.use('/admin', (req,res,next)=>{
  res.locals.layout = 'admin/layout';
  next();
})
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/frontend'));


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});


