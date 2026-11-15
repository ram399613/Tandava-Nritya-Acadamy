const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV === 'development';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  global.io = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    socket.on('join_role', (role) => {
      socket.join(`role:${role}`);
    });

    socket.on('join_user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('mark_attendance', (data) => {
      console.log('📡 Attendance broadcast:', data);
      io.emit('attendance_marked', data);
      io.emit('attendance_updated');
    });

    socket.on('timetable_change', (data) => {
      console.log('📡 Timetable update broadcast:', data);
      io.emit('timetable_updated', data);
    });

    socket.on('new_enrollment', (data) => {
      console.log('📡 New enrollment broadcast:', data);
      io.emit('new_enrollment', data);
    });

    socket.on('announcement_broadcast', (data) => {
      console.log('📡 Announcement broadcast:', data);
      io.emit('announcement_received', data);
    });

    socket.on('process_payment', (data) => {
      console.log('📡 Payment broadcast:', data);
      io.emit('payment_updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> 🔥 Tandava Nritya Academy Platform running on port ${port}`);
    console.log(`> ⚡ Real-Time Socket.IO Active on port ${port}`);
  });
});
