(function() {
  angular
    .module('app')
    .controller('PostCtrl', PostCtrl)

  PostCtrl.$inject = ['$scope', '$stateParams', 'postsAPI', 'commentAPI', 'Auth']
  function PostCtrl($scope, $stateParams, postsAPI, commentAPI, Auth) {
    $scope.user = Auth.getCurrentUser()
    $scope.id = $stateParams.postId
    $scope.popPosts = []

    postsAPI.findOnePost($scope.id)
      .then(function(data) {
        console.log(data)
        $scope.post = data.data
        addView()
      })
      .catch(function (err) {
        console.log('failed to get post ', err)
      })

    postsAPI.popPosts($scope.id)
      .then(function(data) {
        console.log(data)
        $scope.popPosts = data.data
      })
      .catch(function (err) {
        console.log('failed to get p post ', err)
      })

    commentAPI.getComments($scope.id)
      .then(function(data) {
        console.log(data)
        $scope.comments = data.data
      })
      .catch(function (err) {
        console.log('failed to get comments ' + err)
      })

    $scope.addVote = function(post) {
      PostsAPI.upVotePost(post)
        .then(function(data) {
          console.log(data)
          post.upVotes++
        })
        .catch(function (err) {
          console.log('failed adding upvote ')
        })
    }

    $scope.postComment = function () {
      var comment = {
        authorId: $scope.user._id,
        authorName: $scope.user.name,
        authorEmail: $scope.user.email,
        gravatar: $scope.user.gravatar,
        comment: $scope.comment.body,
        postId: $scope.id
      }
      commentAPI.addComment(comment)
        .then(function (data) {
          console.log(data)
          $scope.comment.body = ''
          $scope.comments.splice(0, 0, data.data)
        })
        .catch(function (err) {
          console.log('failed to post comment ' + err)
        })
    }

    function addView() {
      postsAPI.addView($scope.id)
        .then(function(res) {
          console.log('view added to Post')
          console.log(res)
        })
        .catch(function(err) {
          console.log('failed to increment ', err)
        })
    }
  }
})()
