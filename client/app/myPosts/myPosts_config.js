(function() {
  angular
    .module('app')
    .config(config)
    config.$inject = ['$stateProvider']
    function config ($stateProvider) {
      $stateProvider
        .state('myposts', {
          url: '/myposts',
          templateUrl: 'app/myposts/myPosts.html',
          controller: 'MyPostsCtrl',
          authenticate: true
        })
    }
})()
