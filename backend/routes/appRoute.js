const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController.js')

router.post('/', appController.createApp)
router.get('/getApps', appController.getApps)
router.delete('/delete/:id', appController.deleteApp)
router.put('/edit/:id', appController.editApp)
router.get('/getApps/:id', appController.getAppsById)

module.exports = router;