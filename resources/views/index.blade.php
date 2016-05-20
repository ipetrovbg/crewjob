<!DOCTYPE html>
<html ng-app="crewjob">

<head>
    <title>CrewJob</title>
    <base href="/">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="css/loading-bar.css">

    <link rel="shortcut icon" href="css/images/favicon.png"/>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic'
          rel='stylesheet' type='text/css'>
    <link href="css/crewjob.css" rel="stylesheet">

    <link rel="stylesheet" href="css/font-awesome.min.css" type="text/css" media="all"/>
    {{--<link rel="stylesheet" href="css/font-awesome.css" type="text/css" media="all"/>--}}
            <!-- <link rel="stylesheet" href="css/owl.carousel.css" type="text/css" media="all"/> -->
    <link href="css/angular-carousel.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="css/style.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/ADM-dateTimePicker.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/toastino.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/dropdown.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/light.css" type="text/css" media="all"/>
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
</head>

<body>


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
<script type="text/javascript" src="js/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/core.js"></script>
<script type="text/javascript" src="js/dropdown.js"></script>
<!-- <script type="text/javascript" src="js/functions.js"></script> -->
{{--<script type="text/javascript" src="js/jquery.fs.selecter.js"></script>--}}
<!-- <script type="text/javascript" src="js/owl.carousel.js"></script> -->

<script type="text/javascript" src="app/angularjs.js"></script>
<script type="text/javascript" src="app/angular-simple-logger.js"></script>
<script src="app/angular-file-upload.min.js"></script>
<script src="app/ng-infinite-scroll.min.js"></script>
<script type="text/javascript" src="app/ADM-dateTimePicker.js"></script>
<script type="text/javascript" src="app/angular-touch.min.js"></script>
<script type="text/javascript" src="app/hamster.js"></script>
<script type="text/javascript" src="app/angular-route.js"></script>
<script type="text/javascript" src="app/angular-ui-router.min.js"></script>
<script type="text/javascript" src="app/loading-bar.js"></script>
<script type="text/javascript" src="app/angular-cookies.min.js"></script>
<script type="text/javascript" src="app/angular-carousel.js"></script>
<script type="text/javascript" src="app/angular-toastino.js"></script>
<script type="text/javascript" src="app/angular-animate.min.js"></script>
<!-- /angular -->
<!-- app -->
<script src="app/app.js"></script>
<!-- /app -->
<!-- controllers -->
<script src="controllers/homeCtrl.js"></script>
<script src="controllers/navigationCtrl.js"></script>
<script src="controllers/loginCtrl.js"></script>
<script src="controllers/accountCtrl.js"></script>
<script src="controllers/portfolioCtrl.js"></script>
<script src="controllers/filesCtrl.js"></script>
<script src="controllers/userCtrl.js"></script>
<script src="controllers/projectCreateCtrl.js"></script>
<script src="controllers/projectViewCtrl.js"></script>
<script src="controllers/projectsCtrl.js"></script>
<script src="controllers/projectEditCtrl.js"></script>
<!-- /controllers -->
<!-- services -->
<script src="services/sha1.js"></script>
<script src="services/auth.js"></script>
<script src="services/portfolioService.js"></script>
<script src="services/categoriesServices.js"></script>
<script src="services/userServices.js"></script>
<script src="services/projectServices.js"></script>
<!-- /services -->
<!-- directives -->
<script src="directives/angular-simple-logger.js"></script>
<script src="directives/angular-google-maps.js"></script>
<script src="directives/mousewheel.js"></script>
<script src="directives/navigation.js"></script>
<script src="directives/rn-carousel.js"></script>
<!-- /directives -->

<script src="filters/limitText.js"></script>


</body>
</html>
