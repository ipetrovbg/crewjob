<!DOCTYPE html>
<html ng-app="crewjob">

<head>
    <title>CrewJob</title>
    <base href="/">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="{{ url('/') }}/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="{{ url('/') }}/css/style.css">
    <link rel="stylesheet" type="text/css" href="{{ url('/') }}/css/loading-bar.css">

    <link rel="shortcut icon" href="{{ url('/') }}/css/images/favicon.png"/>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic'
          rel='stylesheet' type='text/css'>
    <link href="{{ url('/') }}/css/crewjob.css" rel="stylesheet">

    <link rel="stylesheet" href="{{ url('/') }}/css/font-awesome.min.css" type="text/css" media="all"/>
    {{--<link rel="stylesheet" href="css/font-awesome.css" type="text/css" media="all"/>--}}
            <!-- <link rel="stylesheet" href="css/owl.carousel.css" type="text/css" media="all"/> -->
    <link href="{{ url('/') }}/css/angular-carousel.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="{{ url('/') }}/css/style.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="{{ url('/') }}/css/ADM-dateTimePicker.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="{{ url('/') }}/css/toastino.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="{{ url('/') }}/css/dropdown.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="{{ url('/') }}/css/light.css" type="text/css" media="all"/>
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
</head>

<body>
<div class="loading" animate="">
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
</div>

<div class="container">
    <div class="content">

        <toastino></toastino>
    </div>

</div>

<div class="crewjob-view" ng-view>

</div>


<!-- </div> -->
<!-- footer -->
<footer class="footer">
    <div class="shell clearfix">
        <p class="copyrights">Copyrights &copy; Web site by <a href="#">CrewJob</a>.</p>

        <div class="social-links">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
            <a href="#"><i class="fa fa-google-plus"></i></a>
            <a href="#"><i class="fa fa-linkedin"></i></a>
        </div>
    </div>
</footer>
<!-- /footer -->
<script>
    var base_url = "{{ url('/') }}";
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA3LPNwbfVuv8eO0oqNNjpskerGBudoytE"
        async defer></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/lodash/4.11.2/lodash.js"></script>
<script type="text/javascript" src="{{ url('/') }}/js/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="{{ url('/') }}/js/bootstrap.min.js"></script>
{{--<script type="text/javascript" src="{{ url('/') }}/js/ui-bootstrap-custom-tpls-1.3.3.min.js"></script>--}}
<script type="text/javascript" src="{{ url('/') }}/js/core.js"></script>
<script type="text/javascript" src="{{ url('/') }}/js/dropdown.js"></script>
<!-- <script type="text/javascript" src="js/functions.js"></script> -->
{{--<script type="text/javascript" src="js/jquery.fs.selecter.js"></script>--}}
<!-- <script type="text/javascript" src="js/owl.carousel.js"></script> -->

<script type="text/javascript" src="{{ url('/') }}/app/angularjs.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-simple-logger.js"></script>
<script src="{{ url('/') }}/app/angular-file-upload.min.js"></script>
<script src="{{ url('/') }}/app/ng-infinite-scroll.min.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/ADM-dateTimePicker.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-touch.min.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/hamster.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-route.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-ui-router.min.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/loading-bar.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-cookies.min.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-carousel.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-toastino.js"></script>
<script type="text/javascript" src="{{ url('/') }}/app/angular-animate.min.js"></script>
<!-- /angular -->
<!-- app -->
<script src="{{ url('/') }}/app/app.js"></script>
<script src="{{ url('/') }}/app/ng-rating.js"></script>
<script src="{{ url('/') }}/app/ui-bootstrap-custom-1.3.3.min.js"></script>
<script src="{{ url('/') }}/app/ui-bootstrap-custom-tpls-1.3.3.min.js"></script>
<!-- /app -->
<!-- controllers -->
<script src="{{ url('/') }}/controllers/homeCtrl.js"></script>
<script src="{{ url('/') }}/controllers/navigationCtrl.js"></script>
<script src="{{ url('/') }}/controllers/loginCtrl.js"></script>
<script src="{{ url('/') }}/controllers/accountCtrl.js"></script>
<script src="{{ url('/') }}/controllers/portfolioCtrl.js"></script>
<script src="{{ url('/') }}/controllers/filesCtrl.js"></script>
<script src="{{ url('/') }}/controllers/userCtrl.js"></script>
<script src="{{ url('/') }}/controllers/projectCreateCtrl.js"></script>
<script src="{{ url('/') }}/controllers/projectViewCtrl.js"></script>
<script src="{{ url('/') }}/controllers/projectsCtrl.js"></script>
<script src="{{ url('/') }}/controllers/projectEditCtrl.js"></script>
<script src="{{ url('/') }}/controllers/ModalApplyCtrl.js"></script>
<script src="{{ url('/') }}/controllers/ModalProjectCloseCtrl.js"></script>
<script src="{{ url('/') }}/controllers/ModalMessageCtrl.js"></script>
<script src="{{ url('/') }}/controllers/ModalViewMessageCtrl.js"></script>
<!-- /controllers -->
<!-- services -->
<script src="{{ url('/') }}/services/sha1.js"></script>
<script src="{{ url('/') }}/services/auth.js"></script>
<script src="{{ url('/') }}/services/portfolioService.js"></script>
<script src="{{ url('/') }}/services/categoriesServices.js"></script>
<script src="{{ url('/') }}/services/userServices.js"></script>
<script src="{{ url('/') }}/services/projectServices.js"></script>
<!-- /services -->
<!-- directives -->
<script src="{{ url('/') }}/directives/angular-simple-logger.js"></script>
<script src="{{ url('/') }}/directives/angular-google-maps.js"></script>
<script src="{{ url('/') }}/directives/mousewheel.js"></script>
<script src="{{ url('/') }}/directives/navigation.js"></script>
<script src="{{ url('/') }}/directives/rn-carousel.js"></script>
<!-- /directives -->

<script src="{{ url('/') }}/filters/limitText.js"></script>


</body>
</html>
