var express = require('express');
var webot = require('weixin-robot');

var log = require('debug')('webot-example:log');
var verbose = require('debug')('webot-example:verbose');
var news=require('./news');
// 启动服务
var app = express();
// 实际使用时，这里填写你在微信公共平台后台填写的 token
var wx_token = 'weixin';
// 载入webot1的回复规则
require('./rules')(webot);

// 启动机器人, 接管 web 服务请求
webot.watch(app, { token: wx_token, path: '/' });
// 若省略 path 参数，会监听到根目录
// webot.watch(app, { token: wx_token });

// 如果需要 session 支持，sessionStore 必须放在 watch 之后
app.use(express.cookieParser());
// 为了使用 waitRule 功能，需要增加 session 支持
app.use(express.session({
    secret: 'abced111',
    store: new express.session.MemoryStore()
}));
// 在生产环境，你应该将此处的 store 换为某种永久存储。
// 请参考 http://expressjs.com/2x/guide.html#session-support

// 当然，如果你的服务器允许，你也可以直接用 node 来 serve 80 端口
 app.listen(9980);

if(!process.env.DEBUG){
    console.log("set env variable `DEBUG=webot-example:*` to display debug info.");
}
