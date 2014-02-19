/*jslint node: true*/
/*jslint plusplus: true*/

"use strict";
var connection = require("mysql").createConnection({
    host     : '54.213.2.15',
    user     : 'ghost',
    password : '!pwd4ghost',
    database : 'ghost',
    charset : 'utf8'
});


var gettop5 = function (next) {
    var query = "select  title, slug from posts order by `created_at` desc limit 5";
    connection.query(query,
            function (err, rows, fields) {
            var i, items = [];
            if (err) {
                throw err;
            }
            for (i = 0; i < rows.length; i++) {
                items.push({title: rows[i].title, slug: rows[i].slug});
            }
            next(items);
        });
};

var getbytag = function (tag, next) {
    var query = ["select a.title, a.slug from posts a",
        "join posts_tags c on c.`post_id`=a.id",
        "join tags b on c.`tag_id`=b.id",
        "where b.`name`='" + tag + "'"].join('\n');
    connection.query(query,
            function (err, rows, fields) {
            var i, items = [];
            if (err) {
                throw err;
            }
            for (i = 0; i < rows.length; i++) {
                items.push({title: rows[i].title, slug: rows[i].slug});
            }
            next(items);
        });
};

module.exports.gettop5 = gettop5;
module.exports.getbytag = getbytag;
