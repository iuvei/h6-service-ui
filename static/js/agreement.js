$(function (){
	// $("title").html(baseData.pageTitle);
	// $("#appleTitle").attr("content", baseData.pageTitle);
	var skin = localStorage.getItem("skinName");
	if(skin == null || skin == ""){
		skin = "hr";
		localStorage.setItem("skinName", skin);
	}
    console.log(skin)
    $("#confirmBtn").click(function () {
        if(localStorage.getItem("changePwd") == 1){
            window.open(skin + "_password.html?v=" + version, "_self");
        }
        else{
            if (skin === 'hr') {
                window.open("index.html?v=" + version, "_self");
            } else {
                window.open(skin + "_index.html?v=" + version, "_self");
            }
        }
    });
    $("#cancelBtn").click(function () {
        GotoLogin();
    });
});