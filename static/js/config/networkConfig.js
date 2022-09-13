var httpUrlData = {                            
	login: {name: "登录", url: "/login", server: "MarkSixGame"},
	logOut: {name: "登出", url: "/logOut", type: 'get', server: "MarkSixGame"},
	getVerifyCode: {name: "获取验证码", url: "http://h6-api-server.wysdjx.com/captcha/captcha.jpg?uuid=", server: "MarkSixGame"},
	verifyCheckCode: {name: "检查验证码", url: "/index/checkCode", type: 'get', server: "MarkSixGame"},
	getUserPlay: {name: "检查验证码", url: "/p/user/userPlay", type: 'get', server: "MarkSixGame"},
	getUserInfo: {name: "检查验证码", url: "/p/user/userInfo", type: 'get', server: "MarkSixGame"},
	listDailyLedger: {name: "账户历史查询每日总账", url: "/p/commandLog/findAccountinglog", server: "MarkSixGame"},
	accountDetail: {name: "查询账户历史明细", url: "/p/commandLog/findAccountinglogDetail", type: 'post', server: "MarkSixGame"},
	listBetDetailList: {name: "查询下注明细", url: "/p/commandLog/currentLog", type: 'post', server: "MarkSixGame"},
	listBetDetail: {name: "查询下注明细", url: "/p/commandLog/commandLogInfo", type: 'post', server: "MarkSixGame"},
	getGameData: {name: "获取游戏数据", url: "/p/creditPlayType/findCreditPlayTypeInfo", type: 'post', server: "MarkSixGame"},
	newListBet: {name: "最新10笔注单", url: "/p/commandLog/top10ByUser", type: 'get', server: "MarkSixGame"},
	currentPeriod: {name: "当前期数查询列表", url: "/p/gameperiod/queryEarlyMorningSetPeriod", type: 'get', server: "MarkSixGame"},
	

	generalBet : {name: "普通下注", url: "/p/commandLog/createCommandLog", server: "MarkSixBet"},
	multiNumBet: {name: "连码下注", url: "/MarkSixBet/Bet/multiNumBet", server: "MarkSixBet"},
	getInstantResultNum: {name: "获取即时开奖号码", url: "/MarkSixGame/Game/getInstantResultNum", server: "MarkSixGame"},
	listLotteryResult: {name: "分页查询开奖结果", url: "/p/gameperiod/getGamePeriod", type: 'post', server: "MarkSixGame"},
	listClearedOrder: {name: "账户历史查询已结注单", url: "/MarkSixGame/GameRecord/listClearedOrder", server: "MarkSixGame"},
	updatePassword: {name: "修改密码", url: "/p/user/password", type: 'post', server: "MarkSixGame"},
	listNotice: {name: "查询公告", url: "/p/gameperiod/getEntertainingDiversions", type: 'get', server: "MarkSixGame"},
	getMemberMaterial: {name: "查询会员资料", url: "/p/user/userPlay", type: 'get', server: "MarkSixGame"},
	getCurrentResultNum: {name: "查询当前期开奖号码", url: "/MarkSixGame/Game/getCurrentResultNum", server: "MarkSixGame"},
	getGameList: {name: "获取游戏列表", url: "/p/gametype/getGameTypeList", type: 'get', server: "MarkSixGame"},
	refresh: {name: "刷新", url: "/index/refresh", type: 'get', server: "MarkSixGame"},
	testSpeed: {name: "测速", url: "/index/testSpeed", type: 'get', server: "MarkSixGame"},
	
}