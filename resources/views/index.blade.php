<!DOCTYPE html>
<html ng-app="crewjob">
    <head>
        <title>CrewJob</title>
         <base href="/">
        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">   
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <link rel="stylesheet" type="text/css" href="css/loading-bar.css">
        <meta name="csrf-token" content="{{ csrf_token() }}" />     
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div ng-view></div>
            </div>
        </div>
        <script>
            var base_url        = "{{ url('/') }}";
        </script>
        <!-- angular -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA3LPNwbfVuv8eO0oqNNjpskerGBudoytE"
    async defer></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/lodash/4.11.2/lodash.js"></script>
        <script type="text/javascript" src="js/jquery-1.12.3.min.js"></script>
        <script type="text/javascript" src="js/bootstrap.min.js"></script>
        <script type="text/javascript" src="app/angularjs.js"></script>
        <script type="text/javascript" src="app/hamster.js"></script>
        <script type="text/javascript" src="app/angular-route.js"></script>
        <script type="text/javascript" src="app/angular-ui-router.min.js"></script>
        <script type="text/javascript" src="app/loading-bar.js"></script>
        <script type="text/javascript" src="app/angular-cookies.min.js"></script>
        <!-- /angular -->
        <!-- directives -->
        <script src="directives/angular-simple-logger.js"></script>
        <script src="directives/angular-google-maps.js"></script>
        <script src="directives/mousewheel.js"></script>
        <!-- /directives -->
        <!-- app -->
        <script src="app/app.js"></script>
        <script src="controllers/homeCtrl.js"></script>
        <!-- /app -->
    </body>
</html>
