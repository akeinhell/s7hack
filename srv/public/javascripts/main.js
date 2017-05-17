var connection = io('http://127.0.0.1:3000');
connection
  .on('connect_error', (err) => {
      console.warn(err.message); // 'G5p5...'
  })
  .on('connect', (socket) => {
      console.log(socket.id); // 'G5p5...'
  })
  .on('connection', (socket) => {
      console.log('connected');

  })
  .on('error', (err) => {
      console.warn(err.message);
  })
;