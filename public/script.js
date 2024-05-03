
const socket = io();

const getDataBtn = document.getElementById('getDataBtn');
getDataBtn.addEventListener('click', () => {
  socket.emit('getData');
});

socket.on('dataResponse', (data) => {
  if (data) {
Swal.fire({
      title: 'Data from Database',
      text: `foo: ${data.foo}`,
      icon: 'success'
    });
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Failed to fetch data from database',
      icon: 'error'
    });
  }
});