var path = require('path')
var _ = require('lodash')

function requiredProcessEnv (name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

// All configurations
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  seedDB: false,

  // Secret for session
  secrets: {
    session: 'sharium-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  keys:{
    access: process.env.access,
    secret: process.env.secret,
    bucket: process.env.bucket,
    region: process.env.region
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },
}

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {})
