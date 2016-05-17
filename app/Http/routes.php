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

Route::get('/', 'homeController@index');
Route::post('/getEmail', 'userController@getEmail');
Route::post('/register', 'userController@register');
Route::post('/login', 'userController@login');
Route::post('/isAuth', 'userController@isAuth');
Route::post('/logout', 'userController@logout');
Route::post('/updateProfile', 'userController@updateProfile');
Route::post('/userDetails', 'userController@userDetails');
Route::post('/upload-profile', 'FileController@upload_profile');
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

//Route::get('/user/:file_name', function(){
//    return View::make('index');
//});
Route::any('{path?}', function()
{
    return view("index");
})->where("path", ".+");