(function () {
  angular
    .module('app')
    .controller('MyPostsCtrl', MyPostsCtrl)
  MyPostsCtrl.$inject = ['$scope', '$modal', '$state', '$alert', 'postsAPI', 'Auth']

  function MyPostsCtrl ($scope, $modal, $state, $alert, postsAPI, Auth) {
    $scope.user = Auth.getCurrentUser()
    var userEmail = $scope.user.email
    $scope.userPosts = []
    $scope.editPost = {}

    var alertSuccess = $alert({
      title: 'Saved ',
      content: 'Post edited',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    })

    var alertFail = $alert({
      title: 'Not Saved ',
      content: 'Post not edited',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'warning',
      duration: 8
    })

    var myModal = $modal({
      scope: $scope,
      show: false
    })

    $scope.showModal = function () {
      myModal.$promise.then(myModal.show)
    }

    $scope.noPosts = function () {
      $scope.userPosts.length === 0
    }

    postsAPI.getUserPosts(userEmail)
      .then(function (data) {
        console.log(data)
        $scope.userPosts = data.data
      })
      .catch(function (err) {
        console.log('failed to get posts ' + err)
      })

    $scope.editPost = function (post) {
      postsAPI.getUpdatePost(post)
        .then(function (data) {
          console.log(data)
          $scope.editPost = data.data
        })
        .catch(function (err) {
          console.log('failed to edit post ' + err)
        })
    }

    $scope.savePost = function () {
      var post = $scope.editPost

      postsAPI.updatePost(post)
        .then(function (data) {
          console.log('Post updated')
          console.log(data)
          $scope.editPost.title = ''
          $scope.editPost.description = ''
          alertSuccess.show()
        })
        .catch(function (err) {
          console.log('failed to update' + err)
          alertFail.show()
        })
    }

    $scope.delete = function (post) {
      var index = $scope.userPosts.indexOf(post)

      postsAPI.deletePost(post)
        .then(function (data) {
          console.log('success, post deleted')
          $scope.userPosts.splice(index, 1)
        })
        .catch(function (err) {
          console.log('failed to delete post' + err)
        })
    }
  }
})()
