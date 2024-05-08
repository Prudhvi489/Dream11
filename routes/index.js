const router = require('express').Router();
const teamroutes = require('./teamroutes');
teamroutes(router)
module.exports=router;