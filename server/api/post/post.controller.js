var _ = require('lodash')
var Post = require('./post.model')
var path = require('path')
var express = require('express')
var utils = require('../../utils/utils.js')

exports.allPosts = function (req, res) {
  Post.find({})
    .sort({
      createTime: -1
    })
    .exec(function (err, posts) {
      if (err) {
        return handleError (res, err)
      }
      if (!posts) {
        return res.send(404)
      }
      console.log(posts)
      return res.status(200)
        .json(posts)
    })
}

exports.userPosts = function (req, res) {
  var userEmail = req.query.email
  Post.find({
    email: {
      $in: userEmail
    }
  })
  .sort({
    createTime: -1
  })
  .exec(function(err, posts) {
    if(err) {
      return handleError (res, err)
    }
    console.log(posts)
    return res.status(200)
      .json(posts)
  })
}

exports.scrapeUpload = function(req, res) {
  var random = utils.randomizer(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

  utils.downloadURI(req.body.image, './client/assets/images/uploads/' + random + '.png', function(filename) {
    console.log('done')

    var newPost = new Post()
    newPost.title = req.body.title
    newPost.image = filename.slice(9)
    newPost.email = req.body.email
    newPost.linkURL = req.body.linkURL
    newPost.description = req.body.description
    newPost.userName = req.body.name
    newPost._creator = req.body._creator
    newPost.createTime = Date.now()
    newPost.upVotes = 0
    newPost.save(function(err, item) {
      if (err) {
        console.log('error occured in saving post')
      } else {
        console.log('Success post saved')
        console.log(item)
        res.status(200)
          .json(item)
      }
    })
  })
}

exports.upload = function (req, res) {
  var newPost = new Post()
  var fileimage = req.middlewareStorage.fileimage

  console.log(req.body)
  newPost.image = '/assets/images/uploads/' + fileimage
  newPost.email = req.body.email
  newPost.linkURL = req.body.linkURL
  newPost.title = req.body.title
  newPost.description = req.body.description
  newPost.userName = req.body.name
  newPost._creator = req.body._creator
  newPost.createTime = Date.now()
  newPost.upVotes = 0

  newPost.save(function(err, post) {
    if(err) {
      console.log('error saving post')
      return res.send(500)
    } else {
      console.log(post)
      res.status(200)
           .send(post)
    }
  })
}

exports.singlePost = function (req, res) {
  Post.findById(req.params.postId, function(err, post) {
    if(err) {
      return handleError(res, err)
    }
    if(!post) {
      return res.send(404)
    }
    return res.json(post)
  })
}

exports.popPosts = function (req, res) {
  Post.find(req.params.id)
    .sort('-upVotes')
    .limit(6)
    .exec(function(err, posts) {
      if (err) {
        return handleError(res, err)
      }
      console.log(posts)
      return res.json(posts)
    })
}

exports.update = function (req, res) {
  if(req.body._id) {
    delete req.body._id
  }
  Post.findById(req.params.id, function(err, post) {
    if(err) {
      return handleError (res, err)
      }
      if(!post) {
        return res.send(404)
      }
      var updated = _.merge(post, req.body)
      updated.save(function(err) {
        if(err) {
          return handleError(res, err)
        }
        console.log(post)
        return res.json(post)
      })
  })
}

exports.delete = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) {
      return handleError(res, err)
    }
    if(!post) {
      return res.send(404)
    }
    post.remove(function (err) {
      if(err) {
        return handleError(res, err)
      }
      return res.send(200)
    })
  })
}

exports.addView = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) {
      return handleError(res, err)
    }
    if (!post) {
      return res.send(404)
    }
    post.views++
    post.save(function (err) {
      if (err) {
        return handle(res, err)
      }
      return res.json(post)
    })
  })
}

exports.addUpvote = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) {
      return handleError(res, err)
    }
    if(!post) {
      return res.send(404)
    }
    post.upVotes++
    post.save(function (err) {
      if(err) {
        return handleError (res, err)
      }
      return res.json(post)
    })
  })
}

function handleError (res, err) {
  return res.send(500, err)
}
