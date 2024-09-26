
const jwt = require('jsonwebtoken')

const generateToken = (res, userId) =>{
    const token = jwt.sign({userId}, "keep smiling",{
        expiresIn: '30d'
    })
    res.cookie("jwt", token,{
        httpOnly: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}
exports.generateToken = generateToken