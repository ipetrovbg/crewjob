<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectCategoryRelation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_category_relation', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('category_ID')->unsigned();
            $table->foreign('category_ID')->references('id')->on('category');
            $table->integer('project_ID')->unsigned();
            $table->foreign('project_ID')->references('id')->on('projects');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('project_category_relation');
    }
}
