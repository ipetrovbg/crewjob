(function(){    var projectServices = function ($http) {        var createEmptyProject = function(){            return $http({                url: 'http://localhost:8000/create-empty-project',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var createProject = function(categories, title, description, projectID){            return $http({                url: 'http://localhost:8000/create-project',                method: 'POST',                params: {                    categories:categories,                    title: title,                    description:description,                    projectID: projectID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getProject = function(pr_ID){            return $http({                url: 'http://localhost:8000/get-project',                method: 'POST',                params: {                    pr_ID:pr_ID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var deleteProject = function(project_ID){            return $http({                url: 'http://localhost:8000/delete-project',                method: 'POST',                params: {                    project_ID:project_ID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getProjectCategories = function(project){            return $http({                url: 'http://localhost:8000/get-project-cat',                method: 'POST',                params: {                    project:project                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getLast = function(){            return $http({                url: 'http://localhost:8000/get-last-projects',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getAll = function(){            return $http({                url: 'http://localhost:8000/get-all-projects',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getLimitProjects = function(lastId){            return $http({                url: 'http://localhost:8000/get-limit-projects',                method: 'POST',                params: {                    lastId: lastId                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        return{            createEmptyProject: createEmptyProject,            createProject: createProject,            getProject: getProject,            deleteProject: deleteProject,            getProjectCategories: getProjectCategories,            getLast: getLast,            getAll: getAll,            getLimitProjects: getLimitProjects        };    };    var module = angular.module("crewjob");    module.factory("projectServices", projectServices);}());