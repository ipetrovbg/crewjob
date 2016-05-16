<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use DB;

class userController extends Controller {

    public function getEmail(Request $request) {


        $userEmail = DB::table('users')
                ->where('email', $request['email'])
                ->count();

        if ($userEmail == 0) {
            return response()->json(['hasUser' => $userEmail]);
        } else {
            return response()->json(['hasUser' => 1]);
        }
        // return response()->json(['hasUser' => $userEmail]);
    }

    public function register(Request $request) {
        // $request
        $result = DB::table('users')->insertGetId([
            'email' => $request['email'], 'password' => $request['password'], 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')
        ]);

        if ($result) {
            $request->session()->put('email', $request['email']);
            $request->session()->put('ID', $result);

            return response()->json(['register' => true, 'ID' => $result]);
        } else {
            return response()->json(['register' => false]);
        }

        /*      return inserted id
          $id = DB::table('users')->insertGetId(
          ['email' => 'john@example.com', 'votes' => 0]
          );
         */
          
    }

    public function login(Request $request) {
        $user = DB::table('users')
                        ->where('email', $request['email'])
                        ->where('password', $request['password'])->get();
        if($user){
            // $request->session()->put('name', $user->name);
            $request->session()->put('email', $user[0]->email);
            $request->session()->put('ID', $user[0]->id);
            // $request->session()->put('img', $user->img_path);
            return response()->json(['user' => $user[0]]);
        }else{
            return response()->json(['user' => $user]);
        }
        

        
    }

    public function isAuth(Request $request) {

        $user = $request->session()->get('email');
        if (!empty($user)) {
            return response()->json(['auth' => true]);
        }else{
            return response()->json(['auth' => false]);
        }
    }
    public function logout(Request $request) {
        // $request->session()->forget('name');
        $request->session()->forget('email');
        $request->session()->forget('ID');
        return response()->json(['logout' => true]);
    }

    public function updateProfile(Request $request){

        if($request->session()->get('ID')){
            $response = DB::table('users')
                            ->where('id', $request->session()->get('ID'))
                            ->update(['name' => $request['name'], 
                                'gender' => $request['gender'], 
                                'date_of_birth' => $request['date'], 
                                'description' => $request['description']]);

            
            if($response){
                return response()->json(['status' => true]);
            }else{
                return response()->json(['status' => false]);
            }
        }else{
            return response()->json(['auth' => false]);
        }
    }

    public function userDetails(Request $request){

        $user = DB::table('users')
                        ->where('id', '=', $request->session()->get('ID'))->first();

        $categories = DB::table('users_categories')
                        ->leftJoin('category', 'users_categories.category_id', '=', 'category.id')
                        ->where('user_id', '=', $request->session()->get('ID'))
                        ->get();

        return response()->json(['userdetails' => $user, 'userCategories' => $categories]);
    }


    public function changePass(Request $request)
    {
        if($request->session()->get('ID')){
            $response = DB::table('users')
                ->where('id', $request->session()->get('ID'))
                ->update(['password' => $request['pass']]);

            if($response){
                return response()->json(['status' => true, 'auth' => true]);
            }else{
                return response()->json(['status' => false, 'auth' => true]);
            }
        }else{
            return response()->json(['status' => false, 'auth' => false]);
        }
    }

}

    