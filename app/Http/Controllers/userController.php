<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use DB;

class userController extends Controller
{

    public function getEmail(Request $request)
    {


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

    public function register(Request $request)
    {
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

    public function login(Request $request)
    {
        $user = DB::table('users')
            ->where('email', $request['email'])
            ->where('password', $request['password'])->get();
        if ($user) {
            // $request->session()->put('name', $user->name);
            $request->session()->put('email', $user[0]->email);
            $request->session()->put('ID', $user[0]->id);
            // $request->session()->put('img', $user->img_path);
            return response()->json(['user' => $user[0]]);
        } else {
            return response()->json(['user' => $user]);
        }


    }

//    public function forseLogin(Request $request)
//    {
//        $request->session()->put('email', $request['email']);
//        $request->session()->put('ID', $request['ID']);
//    }
    public function isAuth(Request $request)
    {

        $user = $request->session()->get('email');
        if (!empty($user)) {
            return response()->json(['auth' => true]);
        } else {
            return response()->json(['auth' => false]);
        }
    }

    public function logout(Request $request)
    {
        // $request->session()->forget('name');
        $request->session()->forget('email');
        $request->session()->forget('ID');
        return response()->json(['logout' => true]);
    }

    public function updateProfile(Request $request)
    {
        if ($request->session()->get('ID')) {
            $response = DB::table('users')
                ->where('id', $request->session()->get('ID'))
                ->update(['name' => htmlspecialchars($request['name']),
                    'gender' => $request['gender'],
                    'date_of_birth' => $request['date'],
                    'description' => htmlspecialchars($request['description'])]);


            if ($response) {
                return response()->json(['status' => true, 'auth' => true]);
            } else {
                return response()->json(['status' => false, 'auth' => true]);
            }
        } else {
            return response()->json(['auth' => false]);
        }
    }

    public function userDetails(Request $request)
    {
        if ($request->session()->get('ID')) {
            $user = DB::table('users')
                ->where('id', '=', $request->session()->get('ID'))->first();

            $categories = DB::table('users_categories')
                ->leftJoin('category', 'users_categories.category_id', '=', 'category.id')
                ->where('user_id', '=', $request->session()->get('ID'))
                ->get();

            return response()->json(['userdetails' => $user, 'userCategories' => $categories, 'status' => true]);
        }else{
            return response()->json(['auth' => false, 'status' => false]);
        }

    }


    public function changePass(Request $request)
    {
        if ($request->session()->get('ID')) {
            $response = DB::table('users')
                ->where('id', $request->session()->get('ID'))
                ->update(['password' => $request['pass']]);

            if ($response) {
                return response()->json(['status' => true, 'auth' => true]);
            } else {
                return response()->json(['status' => false, 'auth' => true]);
            }
        } else {
            return response()->json(['status' => false, 'auth' => false]);
        }
    }

    public function getUserSmallInfo(Request $request)
    {
        $user = DB::table('users')
            ->select(DB::raw('users.id as id, users.name as name, users.email as email, users.avatar as avatar'))
            ->where('users.id', $request['userId'])->first();

        if(count($user) == 1){
            return response()->json(['status' => true, 'user' => $user]);
        }else{
            return response()->json(['status' => false]);
        }

    }

    public function getUser(Request $request)
    {
        $user = DB::table('users')
            ->select(DB::raw('users.id as id, users.name as name, users.email as email, users.description as description, users.avatar as avatar,
            users.created_at as created_at, users.gender as gender, users.date_of_birth as date_of_birth'))
            ->where('users.id', $request['userId'])->first();

        $userCategories = DB::table('users_categories')
            ->leftJoin('category', 'users_categories.category_id', '=', 'category.id')
            ->where('user_id', $request['userId'])->get();

        $links = DB::table('links')
            ->where('user_id', '=', $request['userId'])
            ->get();
        $fProjects = DB::table('project_application')
            ->leftJoin('projects', 'project_application.project_id', '=', 'projects.id')
            ->where('project_application.user_id', '=', $request['userId'])
            ->where('project_application.status', '=', 2)
            ->get();

        $count = 0;
        foreach ($fProjects as $fProject) {
        $fpImage = DB::table('files')
            ->where('project_id', '=', $fProject->project_id)
            ->where(function ($query) {
                $query->where('file_type', '=', 'jpg')
                    ->orWhere('file_type', '=', 'png')
                    ->orWhere('file_type', '=', 'gif')
                    ->orWhere('file_type', '=', 'JPG')
                    ->orWhere('file_type', '=', 'JPEG');
            })
            ->first();

            $fProjects[$count]->image = [];
            if($fpImage){
                array_push($fProjects[$count]->image, $fpImage);
            }
            $count++;
        }

        $notFProject = DB::table('project_application')
            ->leftJoin('projects', 'project_application.project_id', '=', 'projects.id')
            ->where('project_application.user_id', '=', $request['userId'])
            ->where('project_application.status', '=', 0)
            ->get();


        $count2 = 0;
        foreach ($notFProject as $notfProject) {
            $notFpImage = DB::table('files')
                ->where('project_id', '=', $notfProject->project_id)
                ->where(function ($query) {
                    $query->where('file_type', '=', 'jpg')
                        ->orWhere('file_type', '=', 'png')
                        ->orWhere('file_type', '=', 'gif')
                        ->orWhere('file_type', '=', 'JPG')
                        ->orWhere('file_type', '=', 'JPEG');
                })
                ->first();

            $notFProject[$count2]->image = [];
            if($notFpImage){
                array_push($notFProject[$count2]->image, $notFpImage);
            }
            $count2++;
        }

        $rating = DB::table('project_application')
            ->select(DB::raw('(SELECT COUNT(id) as c FROM project_application WHERE user_id = '.$request['userId'].' AND status = 2) as project_count, (SELECT SUM(rating) as rat FROM project_application WHERE user_id = '.$request['userId'].') as total_rating'))
            ->where('user_id', '=', $request['userId'])
            ->groupBy('user_id')
            ->get();

        if (count($user) == 1) {
            if (count($userCategories) > 0) {
                return response()->json(['status' => true, 'user' => $user, 'cat' => $userCategories, 'links'=>$links,
                    'finishedP'=>$fProjects, 'notFinishedP'=>$notFProject, 'rating'=>$rating]);
            } else {
                return response()->json(['status' => true, 'user' => $user, 'cat' => false, 'link'=>false,
                    'finishedP'=>$fProjects, 'notFinishedP'=>$notFProject, 'rating'=>$rating]);
            }

        } else {
            return response()->json(['status' => false]);
        }
    }

    public function userRate(Request $request)
    {
        if ($request->session()->get('ID')) {

            $rate = DB::table('project_application')
                ->where('user_id', '=', $request['uid'])
                ->where('project_id', '=', $request['pid'])
//                ->where('rating', '=', null)
                ->update(['rating'=> $request['rating']]);
            if($rate){
                return response()->json(['auth'=> true, 'status' => true]);
            }else{
                return response()->json(['auth'=> true, 'status' => false]);
            }
        }else{
            return response()->json(['auth'=> false, 'status' => false]);
        }
    }

    public function sendMessage(Request $request)
    {
        if ($request->session()->get('ID')) {
            $send = DB::table('messages')
                ->insert(
                    [
                        'receiver' => $request['receiver'],
                        'sender' => $request->session()->get('ID'),
                        'message' => $request['message'],
                        'sender_status' => 1,
                        'created_at' => date('Y-m-d H:m:s'),
                        'updated_at' => date('Y-m-d H:m:s')
                    ]
                );
            if($send){
                return response()->json(['auth'=> true, 'status' => true]);
            }else{
                return response()->json(['auth'=> true, 'status' => false]);
            }
        }else{
            return response()->json(['auth'=> false, 'status' => false]);
        }
    }

    public function getAllMessages(Request $request){
        if ($request->session()->get('ID')) {
            $messages = DB::table('messages')
                ->where('receiver_status', '<', 2)
                ->where('sender_status', '<', 2)
                ->where('receiver', '=', $request->session()->get('ID'))
                ->orWhere('sender', '=', $request->session()->get('ID'))
                ->get();
            $c = 0;
            if($messages){
                foreach ($messages as $message) {

                        $sender = DB::table('users')->where('id', '=', $message->sender)->first();
                        $messages[$c]->sender_name = $sender->name;
                        $messages[$c]->sender_email = $sender->email;
                        $messages[$c]->sender_avatar = $sender->avatar;

                        $receiver = DB::table('users')->where('id', '=', $message->receiver)->first();
                        $messages[$c]->receiver_name = $receiver->name;
                        $messages[$c]->receiver_emaile = $receiver->email;
                        $messages[$c]->receiver_avatar = $receiver->avatar;

                    $c++;
                }
                return response()->json(['status' => true, 'messages' => $messages]);
            }else{
                return response()->json(['status' => false]);
            }
        }else{
            return response()->json(['auth'=> false, 'status' => false]);
        }
    }

    public function getMessage(Request $request)
    {
        if ($request->session()->get('ID')) {
            $message = DB::table('messages')
                ->where('id', '=', $request['id'])
                ->where('receiver_status', '<', 2)
                ->where('sender_status', '<', 2)->first();
            if($message){
                return response()->json(['auth'=> true, 'status' => true, 'message'=>$message]);
            }else{
                return response()->json(['auth'=> true, 'status' => false]);
            }
        }else{
            return response()->json(['auth'=> false, 'status' => false]);
        }
    }

    public function updateMsgStatus(Request $request)
    {
        if ($request->session()->get('ID')) {
            $update = DB::table('messages')
                ->where('id', '=', $request['id'])
                ->where($request['author'], '=', $request->session()->get('ID'))
                ->update([$request['author'] . '_status'=>1, 'updated_at' => date('Y-m-d H:m:s')]);
            if($update){
                return response()->json(['auth'=> true, 'status' => true]);
            }else{
                return response()->json(['auth'=> true, 'status' => false]);
            }
        }else{
            return response()->json(['auth'=> false, 'status' => false]);
        }
    }

}

    