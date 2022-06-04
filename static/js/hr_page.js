
var PAGE_SIZE = 20;
var SHOW_PAGE = 10;
var showData = {};
var getData = {};
var pageTotal = 0;
var curPage = 0;
function initPage(getDataCall, showDataCall, showPage, pageSize){
	SHOW_PAGE = showPage;
	PAGE_SIZE = pageSize;
	getData = getDataCall;
	showData = showDataCall;
}

function setPage(count, index){
    curPage = index;
    var pageCount = Math.ceil(count / PAGE_SIZE);
    if(pageCount == 0){
        $(".pageRow").html('<div class="noData">当前没有数据。。。</div>');
		showData();
        return;
    }
	var html = '';
    if(index >= pageCount || index < 0)  return;
    if(index > 0)
        html += '<div class="prev" onclick="prev();"><<</div>';
    var begin = Math.floor(index / SHOW_PAGE) * SHOW_PAGE;
    for(var i = 0;i + begin < pageCount && i < SHOW_PAGE; i++){
        if(i + begin == index)
            html += '<div class="curPage">' + (i + begin + 1) + '</div>';
        else
            html += '<div class="page" onclick="clickPage(' + (i + begin) + ')">' + (i + begin + 1) + '</div>';
    }
    if(index < pageCount - 1)
        html += '<div class="next" onclick="next()">>></div>';
    $(".pageRow").html(html);
    showData();
}
function clickPage(page){
	getData(page);
}

function next(){
    getData(curPage + 1);
}

function prev() {
    getData(curPage - 1);
}