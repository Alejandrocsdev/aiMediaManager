const pad = (num) => num.toString().padStart(2, '0');

// MMDDHHMMSS
const timestamp = () => {
  const date = new Date();
  return (
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

module.exports = timestamp;
