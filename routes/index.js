const auth_api = require ('../controllers/auth');
const user_api = require ('../controllers/user');
const file_api = require ('../controllers/file');
const product_api = require ('../controllers/product');
const passpoerService = require ('../services/passport');
const passport = require ('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});
//by default passport use cookies base session

const fb_auth = passport.authenticate("facebook", { session: false, scope : 'email' });
const google_auth = passport.authenticate("google", { session: false, scope : ['profile', 'email'] });

let multer  = require( 'multer');

// function HttpErr(code, message) {
//   this.code = code || 500;
//   this.message = message || 'Internal Server Error';
// //   this.stack = (new Error()).stack;
// }
// HttpErr.prototype = Object.create(Error.prototype);
// HttpErr.prototype.constructor = HttpErr;


module.exports = function(app){
    app.use(passport.initialize());
    app.get('/api/checkAuth',requireAuth, auth_api.check_auth)

    .get('/api/account',requireAuth, user_api.get_detail)
    .post('/api/account',requireAuth, multer({ storage : file_api.picStorage }).single('upload_picture'), user_api.post_detail)
    .post('/api/account/rate/:id',requireAuth, user_api.post_rate)
    .post('/api/account/favorite/:id',requireAuth, user_api.post_favorite)

    .get('/auth/facebook',fb_auth)
    .get('/auth/fb/callback', passport.authenticate('facebook',  { session: false}), auth_api.signin)
    .get('/auth/google',google_auth)
    .get('/auth/google/callback', passport.authenticate('google',  { session: false}), auth_api.signin)

    .post('/api/socialLogin/google', auth_api.client_signin)
    .post('/api/socialLogin/facebook', auth_api.client_signin)

    .post ('/api/signin', requireSignin, auth_api.signin)
    .post ('/api/signup', auth_api.signup)
    .post ('/api/add_user', requireAuth, multer({ storage : file_api.picStorage }).single('upload_picture'), auth_api.add_user)

    .delete('/api/details/:id', requireAuth, product_api.delete)

    .post('/api/file/images/:id', requireAuth, multer({ storage : file_api.imageStorage }).array('upload_images', 12), file_api.add_images)
    .post('/api/file/docs/:id', requireAuth, multer({ storage : file_api.docsStorage }).array('upload_docs', 12), file_api.add_docs)

    .post('/api/details/:id',  requireAuth, product_api.post_detail )


    .get('/api/details/:id',  product_api.get_detail )
    
    .get('/api/categories', product_api.get_categories)


    .get('/api/category/:id', product_api.get_category )

    .get('*',function(req,res){
        res.send('page not found');
    });

};