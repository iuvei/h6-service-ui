function DateFormat(date, fmt)
{ //author: meizz
    var o = {
        "y+" : date.getYear(),                 //年
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
// 替换占位符
function ReplaceStr(replaceParamArr, originalStr){
    if(originalStr == null)  return originalStr;
    if(replaceParamArr != null && replaceParamArr.length > 0){
        for(var i = 0; i < replaceParamArr.length; i++){
            originalStr = originalStr.replace(new RegExp("\\{"+i+"\\}","g"), replaceParamArr[i]);
        }
    }
    return originalStr;
}
function getUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");
    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;
        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");
            if (arr != null && arr[0] == paraName) {
                return arrPara[i].substr(arrPara[i].indexOf("=") + 1);
            }
        }
        return "";
    } else {
        return "";
    }
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}

function setCookie(c_name,value,doamin,expiredays,)
{
    expiredays = expiredays==null ? 7 : expiredays;
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    console.log(c_name+ "=" +value+(";expires="+exdate.toGMTString()) + ';domain=' + doamin)
    document.cookie=c_name+ "=" +value+
        (";expires="+exdate.toGMTString()) + ';domain=' + doamin
}

/**
 * 將秒數格式化為時分秒
 */
function formatSeconds(theTime) {
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if(theTime >= 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 >= 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
        }
    }
    if(theTime<10 && theTime1 == 0 && theTime2 == 0){
        var result = "00:0"+parseInt(theTime)+"";
    }else if(theTime>=10 && theTime1 ==0 && theTime2 == 0){
        var result = "00:"+parseInt(theTime)+"";
    }else if(theTime<10){
        var result = "0"+parseInt(theTime)+"";
    }else{
        var result = ""+parseInt(theTime)+"";
    }
    if(theTime1 > 0) {
        if(theTime1 < 10){
            result = "0"+parseInt(theTime1)+":"+result;
        }else{
            result = ""+parseInt(theTime1)+":"+result;
        }
    }
    if(theTime2 > 0) {
        if(theTime2 <10){
            result = "0"+parseInt(theTime2)+":"+result;
        }else{
            result = ""+parseInt(theTime2)+":"+result;
        }
    }
    return result;
}

//只能输入纯数字
function clearNaN(obj){
    obj.value = obj.value.replace(/[^\d]/g,"");  //清除“数字”以外的字符
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}

/**
 * 清除小数点后多余的0
 * @param num
 * @returns {*}
 */
function removeNeedless0(num){
    num += "";
    if(num.indexOf(".") > 0){
        for(var i = num.length - 1; i >= 0; i--){
            if(num[i] == "0" )
                num = num.substring(0, num.length - 1);
            else if(num[i] == "."){
                num = num.substring(0, num.length - 1);
                break;
            }
            else
                break;
        }
    }
    return num;
}
// num为传入的值，n为保留的小数位
function fomatFloat(num,n){
    var f = parseFloat(num);
    if(isNaN(f)){
        return false;
    }
    f = Math.round(num*Math.pow(10, n))/Math.pow(10, n); // n 幂
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if(rs < 0){
        rs = s.length;
        s += '.';
    }
    while(s.length <= rs + n){
        s += '0';
    }
    return s;
}
// 字符串转unicode
function tounicode(data)
{
    //return encodeURIComponent(data);                    // 编译一次,后台不需要做任何处理
    return encodeURIComponent(encodeURIComponent(data)); //编译了两次,后台需转码
}
function  createUUID() {
    var ele = [1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','W','R','S','T','U','V','W','X','Y','Z','-']
    var result = ''
    for (var i = 0; i < 36; i++) {
        var random = parseInt(Math.random() * ele.length)
        result += ele[random]
    }
    return result
}
document.oncontextmenu = function (event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}
