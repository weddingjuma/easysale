app.controller('shopownerCtrl', function ($scope, $modal, $filter, Data) {
    $scope.product = {};
	//$scope.title =null;
	$scope.config = {
	    itemsPerPage: 5,
	    fillLastPage: true
	  }

    Data.get('listowners').then(function(data){
        $scope.products = data.data;
    });
    $scope.changeProductStatus = function(product){
        product.status = (product.status=="1" ? "0" : "1");
        Data.post("changestatus",{status:product.status,id:product.owner_id});
    };
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            Data.post("deleteowner",product).then(function(result){
                $scope.products = _.without($scope.products, _.findWhere($scope.products, {owner_id:product.owner_id}));
            });
        }
    };
    $scope.open = function (p,size) {
	      var modalInstance = $modal.open({
          templateUrl: '../app/shops/partials/ownerEdit.html',
          controller: 'shopownerEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {

            if(selectedObject.save == "insert"){
               
			    //$scope.products.splice(0,0,selectedObject);
				$scope.products.unshift(selectedObject);
				//$scope.products.push(selectedObject);
                //$scope.products = $filter('orderBy')($scope.products, 'owner_id', 'reverse');
				
            }else if(selectedObject.save == "update"){
                p.address = selectedObject.address;
                p.phone = selectedObject.phone;
                p.business_name = selectedObject.business_name;
            }
        });
    };
    
 $scope.columns = [
                    {text:"ID",predicate:"owner_id",sortable:true,dataType:"number"},
                    {text:"Name",predicate:"name",sortable:true},
                    {text:"PHONE",predicate:"phone",sortable:true},
                    {text:"BUSINESS NAME",predicate:"business",sortable:true},
                    {text:"ADDESS",predicate:"address",sortable:true},
                    {text:"Status",predicate:"status",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

});


app.controller('shopownerEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.owner_id > 0) ? 'Edit Owner' : 'Add Owner';
        $scope.buttonText = (item.owner_id > 0) ? 'Update Owner' : 'Add New Owner';

        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            product.uid = $scope.uid;
            if(product.owner_id > 0){
                Data.post('updateowner', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                product.status = 1;
                Data.post('createowner', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.owner_id = result.data;						
                        $modalInstance.close(x);
                    }else{
                        //console.log(result);
						$scope.suberr=result.error;
                    }
                });
            }
        };
});
