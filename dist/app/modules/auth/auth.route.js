"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
// import passport from "passport";
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.AuthControllers.credentialsLogin);
router.post('/refresh-token', auth_controller_1.AuthControllers.getNewAccessToken);
router.post('/logout', auth_controller_1.AuthControllers.logout);
router.post('/reset-password', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.resetPassword);
// google auth is currently off.
// router.get('/google', async (req: Request, res: Response, next: NextFunction) => {
//     const redirect = req.query.redirect || '/'
//     passport.authenticate('google', { scope: ['profile', 'email'], state: redirect as string })(req, res, next)
// })
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), AuthControllers.googleCallbackController);
exports.AuthRoutes = router;
