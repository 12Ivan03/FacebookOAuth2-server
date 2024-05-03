const router = require("express").Router();
const { default: axios } = require("axios");
const crypto = require('crypto');
const jwt = require('jsonwebtoken')


const FACEBOOK_REDIRECT_URI = 'http://localhost:5005/auth/facebook-callback';

router.get("/facebook-login", async (req, res, next) => {

    const generateRandomString = (length) => {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex')
    }
    const state = generateRandomString(16)

    try{
        const ApiResponse = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&state=${state}`;
        console.log('redirect =====> ', ApiResponse)
        res.json({ ApiResponse })
    }catch(err){
        console.log('error message: ',err)
    }
});

router.get("/facebook-callback", async (req, res, next) => {
    const { code } = req.query

    try{
        const response = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`)
        // console.log('This should be the respnse of the call to facebook ', response.data);
        const accessToken = response.data.access_token;

        const facebookResInfo = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`) 
        // console.log('facebookResInfo ===========>', facebookResInfo)
        res.json(facebookResInfo.data)

    }catch(err){
        console.log(err)
    }

    console.log(code )
})

module.exports = router;

// http://localhost:5005/auth/facebook-callback