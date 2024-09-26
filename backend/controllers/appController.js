 const App = require('../models/appModel.js')
const User = require('../models/userModel.js')
 const createApp = async(req, res)=>{
    const {name, subscriptionDate,expiryDate,subscriptionAmount, type, creator} = req.body
    const userExist = await User.findById(creator)
    if(userExist){
        const app = new App({
            name: name,
            subscriptionDate: subscriptionDate,
            type:type,
            creator: creator,
            expiryDate:expiryDate,
            subscriptionAmount:subscriptionAmount
        })
        try {
            const createdApp = await app.save() 
            res.status(201).json({app: createdApp}) 
        } catch (err) {
            res.status(500).json('App is not Created') 
        }
    }else{
        res.status(404).json('User does not exist')
    }
 }

 const getApps = async(req, res)=>{
    try {
        const apps = await App.find({})
        res.status(200).json(apps) 
    } catch (err) {
        res.status(500).json('Apps not found')
    }
}

 const getAppsById = async(req, res)=>{
    try {
        const apps = await App.find({creator:req.params.id})
        res.status(200).json(apps) 
    } catch (err) {
        res.status(500).json('Apps not found')
    }
}


const deleteApp = async(req, res)=>{
    const id = req.params.id
    const app = await App.findById({_id:id})
    if(app ){
        try {  
        await App.deleteOne({_id:id})
        res.status(200).json('App is Deleted') 
        } catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(404).json({message: 'App not found'})
    }
}

const editApp = async(req, res)=>{
    const id = req.params.id
    const app = await App.findById(id)
    const {name, subscriptionDate,expiryDate,subscriptionAmount, type, creator} = req.body 
    if(app){
        if( app.creator.toString() === creator){
        try { 
         app.name = name || app.name
         app.subscriptionAmount = subscriptionAmount || app.subscriptionAmount
         app.subscriptionDate = subscriptionDate || app.subscriptionDate
         app.expiryDate = expiryDate || app.expiryDate
        app.type = type || app.type
        const updatedApp = await app.save()
        res.status(200).json({app: updatedApp}) 
        } catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(401).json({message: 'User is not authorized'})
    }
    }else{
        res.status(404).json({message: 'App not found'})
    }
}

 exports.createApp = createApp
 exports.getApps = getApps
 exports.deleteApp = deleteApp
 exports.editApp = editApp
 exports.getAppsById = getAppsById