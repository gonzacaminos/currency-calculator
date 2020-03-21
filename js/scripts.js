var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
    $scope.exchange = 30.88;
    $scope.currency = "THB";
});

function changeButton(){
	$(".copy").addClass("copied").text("Copied!")
}

function resetButton(){
	$(".copy").removeClass("copied").text("Copy")
}

function reset(){
  var amounts = [];
  localStorage.setItem("recentAmounts", JSON.stringify(amounts));
}

function updateRecentAmounts(value){
  var usd = $(".amount").text().toLocaleString();
  var idr = $(".amount").attr("data-idr").toLocaleString();
  var currentAmount = {idr,usd};
  console.log(idr);
  //console.log(currentAmount);

  var storedAmounts = JSON.parse(localStorage.getItem('recentAmounts')); // getting previous items
  storedAmounts = storedAmounts ? storedAmounts : [];
  var newItems = storedAmounts.concat(currentAmount);

  let noDuplicates = newItems.filter(function({idr}) {  // We create a set to avoid noDuplicates
    return !this.has(idr) && this.add(idr);
  }, new Set);

  noDuplicates = Array.from(noDuplicates);

  localStorage.setItem("recentAmounts", JSON.stringify(newItems));
  console.log(JSON.parse(localStorage.getItem('recentAmounts')));
  renderRecentAmounts();
}

function renderRecentAmounts(){
  $(".amountsList").html("");
  storedAmounts = JSON.parse(localStorage.getItem('recentAmounts'));
  storedAmounts = storedAmounts ? storedAmounts : [];
  storedAmounts = storedAmounts.reverse().slice(0,10);

  $.each( storedAmounts, function( index, value ){
    var list = $('<li> <a href="#" class="copyRecent"  data-clipboard-text="'+value.usd+'">'+value.idr+'</a></li>');
    $(".amountsList").append(list)
  });

}



$(document).ready(function(){
  renderRecentAmounts();
	var clipboard = new ClipboardJS('.copy');
  var clipboardRecent = new ClipboardJS('.copyRecent');

	clipboard.on('success', function(e) {
    updateRecentAmounts();
		changeButton();
	  e.clearSelection();
		setTimeout(resetButton, 1000);

	});

  clipboardRecent.on('success', function(e) {
    $(".copyRecent").removeClass("copied");
    $(e.trigger).addClass("copied");
  });

});
