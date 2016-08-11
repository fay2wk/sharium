(function() {
  angular
    .module('app')
    .controller('MainCtrl', MainCtrl)
  MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'scrapeAPI', '$http', '$alert', 'postsAPI', 'Upload']

  function MainCtrl ($scope, $state, Auth, $modal, scrapeAPI, $http, $alert, postsAPI, Upload) {
    $scope.user = Auth.getCurrentUser()
    $scope.post = {}
    $scope.posts = []
    $scope.scrapePostForm = true
    $scope.showScrapeDetails = false
    $scope.gotScrapeResults = false
    $scope.loading = false

    $scope.picPreview = true
    $scope.uploadPostTitle = true
    $scope.uploadPostForm = false

    $scope.busy = true
    $scope.allData = []
    var page = 0
    var step = 50

    var alertSuccess = $alert({
      title: 'Success! ',
      content: 'New Post added',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    })

    var alertFail = $alert({
      title: 'Not saved',
      content: 'Failed to save',
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

    postsAPI.getAllPosts()
      .then(function (data) {
        console.log('posts found ')
        $scope.allData = data.data
        $scope.nextPage()
        $scope.busy = false
      })
      .catch(function(err) {
        console.log('failed to get posts ' + err)
      })

      $scope.nextPage = function () {
        var postLength = $scope.posts.length
        if($scope.busy) {
          return
        }
        $scope.busy = true
        $scope.posts = $scope.posts.concat($scope.allData.splice(page * step, step))
        page++
        $scope.busy = false
        if($scope.posts.length === 0) {
          $scope.noMoreData = true
        }
      }

      $scope.showUploadForm = function () {
        $scope.uploadPostForm = true
        $scope.scrapePostForm = false
        $scope.uploadPostTitle = false
      }

    // Watch for changes to URL
    $scope.$watch('post.link', function (newVal, oldVal) {
      if (newVal.length > 5) {
        $scope.loading = true
        var link = {
            url: $scope.post.link
          }
        scrapeAPI.getScrapeDetails(link)
          .then(function (data) {
            console.log(data)
            $scope.showScrapeDetails = true
            $scope.gotScrapeResults = true
            $scope.uploadPostTitle = false
            $scope.post.imgThumb = data.data.img
            $scope.post.description = data.data.desc
          })
          .catch(function (data) {
            console.log('failed to return from scrape')
            $scope.loading = false
            $scope.post.link = ''
            $scope.gotScrapeResults = false
          })
          .finally(function () {
            $scope.loading = false
            $scope.uploadPostForm = false
          })
      }
    })

    $scope.addVote = function (post) {
      postsAPI.upVotePost(post)
        .then(function (data) {
          console.log(data)
          post.upVotes++
        })
        .catch(function(err) {
          console.log('failed adding upvote ')
        })
    }

    $scope.addScrapePost = function () {
      var post = {
        description: $scope.post.description,
        title: $scope.post.title,
        image: $scope.post.imgThumb,
        linkURL: $scope.post.link,
        email: $scope.user.email,
        name: $scope.user.name,
        _creator: $scope.user._id
      }
      postsAPI.createScrapePost(post)
        .then(function (data) {
          console.log(data)
          alertSuccess.show()
          $scope.showScrapeDetails = false
          $scope.gotScrapeResults = false
          $scope.post.title = ''
          $scope.post.link = ''
          $scope.posts.splice(0, 0, data.data)
        })
        .catch(function () {
          $scope.showScrapeDetails = false
          alertFail.show()
        })
    }

    $scope.uploadPic = function (file) {
      Upload.upload({
        url: '/api/post/upload',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          file: file,
          title: $scope.post.title,
          description: $scope.post.description,
          email: $scope.user.email,
          name: $scope.user.name,
          linkURL: $scope.post._id,
          _creator: $scope.user._id
        }
      }).then(function(resp) {
        console.log('success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data)
        $scope.posts.splice(0, 0, resp.data)
        $scope.post.title = ''
        $scope.post.description = ''
        $scope.picFile = ''
        $scope.picPreview = false
        alertSuccess.show()
      }, function (resp) {
        alertFail.show()
      })
    }
  }
})()
