const fs = require('fs');
const app = require('http').createServer(function (req, res) {
  fs.readFile('./index.html', function (err, html) {
    res.writeHeader(200, {
      "Content-Type": "text/html"
    });
    res.write(html);
    res.end();
  })
});
const io = require('socket.io').listen(app);
const nickname = {};
io.sockets.on('connection', function (socket) {
  // setting nickname
  socket.on('setnickname', function (m) {
    if (typeof nickname[m] === 'undefined') {
      nickname[m] = {
        count: 0
      };
      socket.emit('nicknamesuccess', m);
      socket.broadcast.emit('msg', {
        nickname: '系統公告',
        msg: '歡迎新成員 ' + m
      });
    } else {
      nickname[m].count++;
      var t = m + '' + nickname[m].count;
      socket.emit('nicknamefail', t);
      socket.broadcast.emit('msg', {
        nickname: '系統公告',
        msg: '歡迎新成員 ' + t
      });
    }
  });
  // broadcast received message
  socket.on('post', function (m) {
    console.log(m);
    socket.broadcast.emit('msg', m);
  })
});

app.listen(80);