(function () {
  angular
    .module('app')
    .config(config)

  config.$inject = ['$stateProvider']

  function config ($stateProvider) {
    $stateProvider
        .state('post', {
          url: '/post/:postId',
          templateUrl: 'app/post/post_detail_view.html',
          controller: 'PostCtrl'
        })
  }
})()
