"use strict";
/**
 * 1.
 * Как бы мне было удобнее всего обрабатывать ошибки?
 * Есть какая-то функция, и идеальным решением было бы
 * просто добавлять какой-то декоратор.
 *
 * Проблема только в том, что удобно этим пользоваться
 * получится только внутри класса. Для остальных случаев
 * это будет работать просто как враппер
 */
// function catchError(rethrow = false) {
//   return (
//     target, property, descriptor
//   ) => {
//     const method = descriptor.value;
//     descriptor.value = async (...args) => {
//       try {
//         return await method.apply(target, args);
//       } catch(error) {
//         error instanceof Error
//           && console.error("not good", error.message);
//         if (rethrow) {
//           throw error;
//         }
//       }
//     }
//   }
// }
// class ToDoApp {
//   todos: Array<Record<string, string>> = [];
//   @catchError()
//   async fetchTodos() {
//     this.todos = await fetch("https://jsonplaceholder.typicode.com/todos");
//     return this.todos;
//   }
// }
// new ToDoApp().fetchTodos().then(console.log);
/**
 * 2.
 * Поскольку декораторы нельзя использовать в любом
 * месте кода, нужна более простая реализация.
 * - [ ] добавить сохранение пользовательских типов
 * Мы всегда принисаем колбэк. Колбек может иметь
 * какие угодно аргументы и возврат.
 *
 * В успешном случае мы возвращаем то же, что и коллбэк
 * В неуспешном — undefined
 *
 * Это означает, что catchError возвращает колбэк
 * Возврат колбэка += void
 *
 * Аргументы вложенного колбэка равны аргументам
 * коллбэка на входе.
 */
function catchError(callback, doSuppress = true, thisArg = null) {
  const onError = (error, doSuppress) => {
    if (doSuppress) {
      console.error("SUPPRESSED");
      console.error(error.message);
    } else {
      console.error("RETHROWED");
      console.error(error.message);
      throw error;
    }
  };
  return (...args) => {
    let prereturn = undefined;
    /**
         * Нужен ли мне здесь finally?
         * Finally нужен для того, чтобы
         * гарантировать выполнение задачи
         * при выходе из try-catch.
         *
         * Возможно, это было бы полезно для
         * чего-то, связанного с prereturn.
         */
    try {
      prereturn = callback.apply(thisArg, args);
    } catch (error) {
      error instanceof Error
                && onError(error, doSuppress);
    }
    if (prereturn && prereturn.then) {
      // console.log("it’s async");
      return new Promise((resolve) => {
        prereturn
          .then(resolve)
          .catch((error) => {
            onError(error, doSuppress);
          });
      });
    }
    // console.log("it’s sync");
    return prereturn;
  };
}
const add = (a, b) => {
  return a + b;
};
const roulette = (item) => {
  const youReDead = Math.floor(Math.random() * 6) === 0;
  if (youReDead) {
    throw new Error("Bad luck on item with title " + item.title + " :—(");
  }
  return item.title;
};
console.log(catchError(add)(4, 7));
const doFetch = (url, options = {}) => {
  return catchError(fetch, false)(url, options);
};
const process = require("node:process");
process.on("uncaughtException", (code) => {
  console.error("Unexpected code " + code + ", but have a nice day");
});
doFetch("https://jsonplaceholder.typicode.com/todos")
  .then((result) => {
    return catchError(result.json, true, result)();
  })
  .then((result) => {
    const mapper = catchError(roulette);
    console.log(result.map(mapper));
  });
