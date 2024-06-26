// function promiseMayThrow(
//   onFullfilled,
//   onRejected
// ): any {
//   return new Promise((resolve, reject) => {
//     this
//       .then(
//         (result) => {
//           onFullfilled.call(this, result, resolve, reject);
//         },
//         (rejection) => {
//           onRejected.call(this, rejection, resolve, reject);
//         }
//       )
//       .catch((error) => {
//         console.error(error.message);
//       });
//   });
// }

// // Ok, maybe I can abuse promise.resolve(sync) to get rid of this kind of duplicate
// const mayThrowWrapper = (callback) => {
//   return (...args) => {
//     try {
//       return callback(...args);
//     } catch(error) {
//       console.error("not ok", error);
//       return error.message;
//     }
//   };
// };

// const onFullfilled = (result, resolve) => {
//   if (result.status > 300 || result.status < 200) {
//     throw new Error("NOT OK STATUS CODE");
//   }

//   result.json().then((json) => {
//     console.log("it’s ok, let’s rethrow it to the next then");
//     resolve(json.slice(0, 3));
//   });
// };

// const onRejected = (_, __, reject) => {
//   reject("you’re broke the fetch, stupid");
// };

// Promise.prototype.mayThrow = promiseMayThrow;

// const doRequest = (url, options = {}) => {
//   return fetch(url, options).mayThrow(onFullfilled, onRejected);
// };

// const mapTodos = (todos) => {
//   const method = Math.random() > 0.5
//     ? "map"
//     : "pam";

//   return todos[method](({ title }) => title);
// };

// doRequest("https://jsonplaceholder.typicode.com/todos")
//   .then(
//     (result) => {
//       console.log(
//         mayThrowWrapper(mapTodos)(result)
//       );
//     },
//     (rejection) => {
//       console.error(rejection);
//     }
//   );
