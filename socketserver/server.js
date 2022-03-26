const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: 'http://localhost:8080',
  },
});

let users = [];
let user = Object.values(users);
console.log('user', user);
const userArray = [];
let connectionsCounter = 0;

io.on('connection', (socket) => {
  // socket.emit('new', socket.id);
  socket.on('chat message', ({ message, data }) => {
    let user = users.find((user) => user.id === data);
    io.emit('chat message', { message: message, user: user });
  });
  socket.on('draw', (data) => {
    io.emit('draw', data);
  });
  socket.on('clear', () => {
    io.emit('clear');
  });
  socket.on('navigate', () => {
    io.emit('navigate');
  });
  socket.on('start', (word) => {
    io.emit('start', word);
  });
  socket.on('updateStores', (data) => {
    console.log('a user ' + data + ' connected');
    connectionsCounter++;
    // users[socket.id] = data;
    users = [...users, data];
    // console.log('user object', users);
    // let user = Object.values(users);
    // console.log('user array', user);
    // userArray.push(data);
    console.log('uzers', users);
    io.emit('updateStores', users);
    console.log(connectionsCounter);
  });

  socket.on('disconnect', () => {
    connectionsCounter === 0 ? (connectionsCounter = 0) : connectionsCounter--;
    // console.log(
    //   `user ${users.length > 0 ? users.find((o) => o.id === socket.id).name : null} disconnected`,
    // );
    // users.filter((x) => {
    //   console.log('filter', x);
    //   // console.log(socket.id);
    //   return x.id != socket.id;
    // })
    console.log('ysysysysysys', users);
    let takenOutUser = users.filter((x) => {
      console.log('filter', x);
      console.log(x.id);
      console.log(socket.id);
      console.log(socket.id === x.id);
      return x.id != socket.id;
    });
    users = takenOutUser;
    console.log('newnenwew', takenOutUser);
    io.emit('updateStores', takenOutUser);
    console.log(connectionsCounter);
    // delete users[socket.id];
  });

  socket.on('randomuser', () => {
    console.log('random user requested');
    console.log('randomuserreq', users);
    io.emit('randomuser', users[Math.floor(Math.random() * users.length)]);
  });

  socket.on('getUsers', () => {
    let user = Object.entries(users);
    console.log(user);
    io.emit('joined users', user);
  });

  socket.on('finishedPosition', () => {
    io.emit('finishedPosition');
  });

  socket.on('startPosition', () => {
    io.emit('startPosition');
  });
});

io.listen(3000);
