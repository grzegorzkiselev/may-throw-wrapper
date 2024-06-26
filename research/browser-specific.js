/**
 * Не ловит асинхронные ошибки
 */
window.onerror = function(message, url, line, col, error) {
  console.error(`${message}\n В ${line}:${col} на ${url}`);
};

fetch("").then(console.log);