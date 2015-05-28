/*------------------------------------------------->
<!-------------------TO DO LIST JS----------------->
<!-------------------------------------------------*/

// Ayy remember you commented out the add post request

angular.module('todoApp', ['ngResource'])	// Module for todolist
.controller('todoList', ['$scope', '$resource', '$http', '$interval', function($scope, $resource, $http, $interval) {
	var serverList = $resource('http://localhost:8080/server/todoList/:command');	// Allow commands to be sent to grails app
	
	$scope.items = serverList.query({command: 'index'});

	$scope.usernames = serverList.query({command: 'indexUsers'});

    $scope.thing = "";	// Entering task default entry

	$scope.priorityOptions =	// List of priority options, name is used for listing options, id for priority color/sort
		["1", "2", "3"];

	$scope.worktypeOptions = // Different types of work options
		["Work", "Personal"];

	$scope.inUserList = function(){	// Check to see if the user has signed in previously
		var newUsername = $scope.username
		var flag = false;
		
		angular.forEach($scope.usernames, function(uname){
			if (uname.name == newUsername){
				flag = true;
			}
		});
		if (flag)
			return true;
		else
			return false;
	};

	$scope.markAs = function(repeatScope){	// Used to toggle whether or not an item is completed
		if (!repeatScope.completed){
			repeatScope.completed = true;
		}
		else {
			repeatScope.completed = false;
		}
	};

	$scope.ifComment = function(repeatScope){	// Check to see whether to display comments
		if (repeatScope.comments == '' || repeatScope.comments == null){
			return false;	
		}
		else{
			return true;	
		}
	}

	$scope.addusername = function(){	// Add a username to the list
		if ($scope.username && !$scope.inUserList()){
			$scope.usernames.push({name: $scope.username});
			var currentUser = $scope.usernames[$scope.usernames.length - 1];
			angular.toJson(currentUser);
			$http.post('http://localhost:8080/server/todoList/addUser', currentUser)
				.success(function(response) {})
				.error(function(response) {alert("Failed to add user");});
			$scope.loggedIn = true;
		}
		if ($scope.username && $scope.inUserList()){
			$scope.loggedIn = true;	
		}
		else{
			alert("Need a username");	
		}
	};

    $scope.add = function(){	// Function used to add a value to list. Value has name, type, and priority.
		if($scope.thing && $scope.username){	
			$scope.items.push(
				{name: $scope.thing,
				 type: $scope.worktypeSelection,
				 priority: $scope.prioritySelection,
				 completed: false,
				 comments: '',
				 creator: $scope.username,
				 assignedTo: $scope.assign.name
			});
			var currentItem = $scope.items[$scope.items.length - 1];
			angular.toJson(currentItem);
			$scope.thing = '';
		}
		else{
			if(!$scope.thing){
				alert("Empty task is not allowed!");
			}
		}
	};

	$scope.updateList = function() {	// Update the list on the server
		serverList.get({command: 'clearList'});
		angular.forEach($scope.items, function (item) {
            serverList.save({command: 'updateList'}, item);
        });
    };

    $scope.clear_all_items = function(){	// Sets "item" array to empty; deletes all.
        $scope.items = [];
		serverList.get({command: 'clearList'});
    };

	$scope.clear_all = function(){	// Sets "item" array to empty; deletes all.
        $scope.items = [];
		$scope.usernames = [];
		serverList.get({command: 'clearList'});
		serverList.get({command: 'removeUsernames'});
		$scope.loggedIn = false;
    };
	
	$scope.clear_selected = function(){
		var itemstmp = $scope.items;	// Keep items
		$scope.items = [];	// Clear list
		angular.forEach(itemstmp, function(itemName){
			if(!itemName.completed){
				$scope.items.push(itemName);	
			}
			else if (itemName.completed){
				serverList.save({command: 'removeItems'}, itemName);	
			}
		});
	};
	
	$interval(function() { $scope.updateList(); }, 300);	// Update the list every 300 milliseconds
}]);