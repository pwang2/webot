/*jslint node : true */
/*jslint nomen : true */
/*jslint plusplus :true */
var debug = require('debug'),
    log = debug('webot-example:log'),
    verbose = debug('webot-example:verbose'),
    error = debug('webot-example:error'),
    _ = require('underscore')._,
    search = require('../lib/support').search,
    package_info = require('../package.json'),
    news = require('../news');
/**
 * 初始化路由规则
 */
module.exports = function (webot) {
    "use strict";
    var reg_help = /^(help|\?)$/i;
    webot.set({
        // name 和 description 都不是必须的
        name: 'hello help',
        description: '获取使用帮助，发送 help',
        pattern: function (info) {
            //首次关注时,会收到subscribe event
            return (info.is('event') && info.param.event === 'subscribe') || (reg_help.test(info.text));
        },
        handler: function () {
            var reply = {
                title: '感谢关注拿达生活铺',
                pic: 'https://s3-ap-southeast-1.amazonaws.com/s3tatic/qr.jpg',
                url: 'http://54.213.101.138',
                description: [
                    '你好，欢迎来到拿达生活铺，你可以尝试',
                    '回复数字 1品牌介绍 ',
                    '回复数字 2折扣推荐 ',
                    '回复数字 3历史消息 ',
                    '若您还有其他疑问，可回复帮助（或 help），拿达会为您作出解答。由于拿达身处美国，因时差等因素未能及时回复还请见谅，谢谢.'
                ].join('\n ')
            };
            // 返回值如果是list，则回复图文消息列表
            return reply;
        }
    });

    // 简单的纯文本对话，可以用单独的 yaml 文件来定义
    require('js-yaml');
    webot.dialog(__dirname + '/dialog.yaml');
    // 回复图文消息
    webot.set('reply_news', {
        description: '发送news,我将回复图文消息你',
        pattern: /^new(s?)\s*(\d*)$/i,
        handler: function (info, next) {
            var reply = [];
            news.gettop5(function (data) {
                var item, i;
                for (i = 0; i < data.length; i++) {
                    item = data[i];
                    reply.push({
                        title: item.title,
                        description: '微信机器人测试帐号：webot',
                        pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg',
                        url: 'http://54.213.2.15/' + item.slug
                    });
                }
                // 发送 "news 1" 时只回复一条图文消息
                next(null, Number(info.param[1]) === 1 ? reply[0] : reply);
            });
        }
    });

    webot.set('1', {
        handler: function (info, next) {
            var item, i, reply = [];
            news.getbytag('品牌介绍', function (data) {
                var item;
                for (i = 0; i < data.length; i++) {
                    item = data[i];
                    reply.push({
                        title: item.title,
                        description: '微信机器人测试帐号：webot',
                        pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg',
                        url: 'http://54.213.2.15/' + item.slug
                    });
                }
                // 发送 "news 1" 时只回复一条图文消息
                next(null, reply);
            });
        }
    });

    //所有消息无法匹配时的fallback
    webot.set(/[\w\W]*/, function (info) {
        // 利用 error log 收集听不懂的消息，以利于接下来完善规则
        // 你也可以将这些 message 存入数据库
        log('unhandled message: %s', info.text);
        info.flag = true;
        return '你发送了「' + info.text + '」,可惜我太笨了,听不懂. 发送: help 查看可用的指令';
    });
};
