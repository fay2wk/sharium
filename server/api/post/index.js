
var controller = require('./post.controller')
var express = require('express')
var router = express.Router()
var auth = require('../../auth/auth.service')

router.post('/scrapeUpload', auth.isAuthenticated(), controller.scrapeUpload)
router.post('/upload', auth.isAuthenticated(), controller.upload)

router.put('/upvote/:id', auth.isAuthenticated(), controller.addUpvote)
router.put('/view/:id', controller.addView)

router.put('/:id', auth.isAuthenticated(), controller.update)

router.get('/getAllPosts', controller.allPosts)
router.get('/getUserPosts', controller.userPosts)

router.get('/:postId', controller.singlePost)
router.get('/popPosts/:id', controller.popPosts)

router.delete('/:id', controller.delete)

module.exports = router
