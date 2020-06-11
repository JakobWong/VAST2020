function SaveResult(){

	console.log(person_image_list)
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(person_image_list));
	var a = document.getElementById('ResultSaver');
	a.href = 'data:' + data;
	a.download = 'new_data.json';
	// a.click();
}