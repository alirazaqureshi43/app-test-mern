const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')


router.get('/',userController.getUsers)
router.post('/createUser',userController.createUser)
router.put('/editUser/:id',userController.editUser)
router.delete('/deleteUser/:id',userController.deleteUser)
router.post('/login', userController.loginUser)
router.put('/resetPassword', userController.resetPassword)

module.exports = router 