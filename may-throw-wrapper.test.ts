import { expect, it } from "vitest";
import { doFetch, catchError } from "./may-throw-wrapper";

it("Обрабатывает синхронные функции", () => {
  const divide = (a: number, b: number) => {
    return a / b;
  };

  expect(
    catchError(
      divide,
      false
    )(14, 7)
  ).toBe(2);
});

it("Перебрасывает ошибки синхронных функций", () => {
  const footShotgun = () => {
    throw new Error("bruh...");
  };

  expect(() => {
    catchError(
      footShotgun,
      false
    )();
  }).toThrowError("bruh");
});

it("Подавляет ошибки синхронных функций", () => {
  expect(
    catchError(
      () => {
        throw new Error("bruh...");
      },
      true
    )()
  ).toBe(undefined);
});

it("Обрабатывает асинхронные функции", async () => {
  const result = await doFetch("https://jsonplaceholder.typicode.com/todos");

  expect(result.status).toBeTruthy();
});

it("Перебрасывает ошибки асинхронных функций", () => {
  expect(
    catchError(
      fetch,
      false
    )("")
  ).rejects.toThrowError("URL");
});

it("Подавляет ошибки асинхронных функций", () => {
  expect(
    catchError(
      fetch,
    )("")
  ).resolves.toBe(undefined);
});

const roulette = (item: { title: string }) => {
  const youReDead = Math.floor(Math.random() * 6) === 0;

  if (youReDead) {
    throw new Error("Bad luck on item with title " + item.title + " :—(");
  }

  return item.title;
};

it("Подавляет ошибки маппинга", () => {
  expect(
    doFetch<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
      .then((result) => {
        return catchError(
          result.json,
          false,
          result
        )();
      })
      .then((result) => {
        const mapper = catchError(roulette);

        result.map(
          mapper
        );
      })
  ).resolves.toBe(undefined);
});

it("Перебрасывает ошибки маппинга", () => {
  expect(
    doFetch<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
      .then((result) => {
        return catchError(
          result.json,
          false,
          result
        )();
      })
      .then((result) => {
        const mapper = catchError(roulette, false);

        result.map(
          mapper
        );
      })
  ).rejects.toThrowError("Bad luck");
});

/**
 * Не получилось протестировать
 * с помощью vitest, перенесено
 * в ./index.html
 */
// it("Глобальный обработчик ошибок в браузере работает", () => {
//   // @vitest-environment jsdom

//   let result = -1;
//   window.onerror = (message, url, line, col, error) => {
//     result = 1;
//     console.error("WINDOW GLOBAL HANDLER: ", error instanceof Error ? error.message : error);
//   };

//   setTimeout(() => {
//     [0, 0, 0].pam((item) => item.title);
//   });

//   setTimeout(() => {
//     expect(result).toBe(1);
//   });
// });

it("Глобальный обработчик ошибок в Ноде работает", () => {
  // @vitest-environment node
  const process = require("node:process");

  var result = -1;
  process.on("uncaughtException", (error) => {
    result = 1;
    console.error("NODE GLOBAL HANDLER:", error instanceof Error ? error.message : error);
  });

  setTimeout(() => {
    throw new Error("No way brotha");
  });

  setTimeout(() => {
    expect(result).toBe(1);
  });
});