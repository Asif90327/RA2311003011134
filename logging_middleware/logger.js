function logger(message) {
  const time = new Date().toISOString();
  console.log(`[LOG ${time}] ${message}`);
}

module.exports = logger;