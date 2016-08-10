(function () {
  angular
    .module('app')
    .factory('postsAPI', postsAPI)

    postsAPI.$inject = ['$http'];

    function postsAPI($http) {
      return {
        createScrapePost: createScrapePost,
        getAllPosts: getAllPosts,
        getUserPosts: getUserPosts,
        findOnePost: findOnePost,
        getUpdatePost: getUpdatePost,
        updatePost: updatePost,
        popPosts: popPosts,
        deletePost: deletePost,
        upVotePost: upVotePost,
        addView: addView
      }

      function createScrapePost (post) {
        return $http.post('/api/post/scrapeUpload', post)
      }

      function getAllPosts () {
        return $http.get('/api/post/getAllPosts', {
          cache: true
        })
      }

      function getUserPosts (id) {
        return $http.get('/api/post/getUserPosts/?email=' + id, {
          cache: true
        })
      }

      function findOnePost(post) {
        return $http.get('/api/post/' + post)
      }

      function popPosts(post) {
        return $http.get('/api/post/popPosts/' + post)
      }

      function getUpdatePost(post) {
        return $http.get('/api/post/' + post._id)
      }

      function updatePost(post) {
        return $http.put('/api/post/' + post._id, post)
      }

      function deletePost(post) {
        return $http.delete('/api/post/' + post._id)
      }

      function upVotePost(post) {
        return $http.put('/api/post/upvote/' + post._id)
      }

      function addView(post) {
        return $http.put('/api/post/view/' + post)
      }
    }
})()
