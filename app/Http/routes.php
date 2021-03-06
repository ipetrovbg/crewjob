<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
//Route::get('{all}', function () {
//    return View::make('index');
//});

Route::group(['middleware' => ['web']], function () {
//Route::group(['prefix' => 'api'], function() {
    Route::get('/', 'homeController@index');
    Route::post('/get-email', 'userController@getEmail');
    Route::post('/register', 'userController@register');
    Route::post('/login', 'userController@login');
    Route::post('/isAuth', 'userController@isAuth');
    Route::post('/logout', 'userController@logout');
    Route::post('/updateProfile', 'userController@updateProfile');
    Route::post('/forseLogin', 'userController@forseLogin');
    Route::post('/userDetails', 'userController@userDetails');
    Route::post('/upload-profile', 'FileController@upload_profile');
    Route::post('/upload-project-file', 'FileController@upload_project_file');
    Route::post('/updateUserCategory', 'PortfolioController@updateUserCategory');
    Route::post('/categories', 'CategoryController@getAll');
    Route::post('/insertLink', 'PortfolioController@insertLink');
    Route::post('/getLinks', 'PortfolioController@getLinks');
    Route::post('/deleteLink', 'PortfolioController@deleteLink');
    Route::post('/upload-files', 'FileController@upload_files');
    Route::post('/getAllFiles', 'FileController@getAllFiles');
    Route::post('/deleteFile', 'FileController@deleteFile');
    Route::post('/changePass', 'userController@changePass');
    Route::post('/getUser', 'userController@getUser');
    Route::post('/get-user-info', 'userController@getUserSmallInfo');
    Route::post('/create-empty-project', 'projectController@createEmptyProject');
    Route::post('/create-project', 'projectController@createProject');
    Route::post('/get-project', 'projectController@getproject');
    Route::post('/delete-project', 'projectController@deleteProject');
    Route::post('/get-project-cat', 'projectController@getProjectCat');
    Route::post('/get-last-projects', 'projectController@getLastProjects');
    Route::post('/get-all-projects', 'projectController@getAllProjects');
    Route::post('/get-limit-projects', 'projectController@getLimitProjects');
    Route::post('/get-project-by-cat', 'projectController@getByCat');
    Route::post('/applying-for-project', 'projectController@applying');
    Route::post('/get-all-my-projects', 'projectController@getMyAll');
    Route::post('/edit-project', 'projectController@edit');
    Route::post('/delete-project-file', 'projectController@deleteFile');
    Route::post('/project-apply', 'projectController@getApply');
    Route::post('/project-staged-close', 'projectController@closeStaged');
    Route::post('/user-rate', 'userController@userRate');
    Route::post('/project-final', 'projectController@makeFinal');
    Route::post('/send-message', 'userController@sendMessage');
    Route::post('/get-all-messages', 'userController@getAllMessages');
    Route::post('/get-message', 'userController@getMessage');
    Route::post('/update-msg-status', 'userController@updateMsgStatus');
});

//Route::get('/user/:file_name', function(){
//    return View::make('index');
//});
Route::any('{path?}', function()
{
    return view("index");
})->where("path", ".+");

//Route::group(['middleware' => 'web'], function () {
//
//});

