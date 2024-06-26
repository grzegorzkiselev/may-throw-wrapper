export function catchError
<T extends (...args: any[]) => any, U extends boolean>(
  callback: T,
  doSuppress: U = true as U,
  thisArg: any = null,
): (...args: Parameters<T>) => U extends true ? ReturnType<T> | void : ReturnType<T> | never {
  const onError = (
    error: Error,
    doSuppress: boolean,
    resolve?: (value?: unknown) => void,
    reject?: (reason: Error) => void
  ) => {
    if (doSuppress) {
      console.error("SUPPRESSED");
      console.error(error.message);

      if (resolve) {
        return resolve();
      }
    } else {
      console.error("RETHROWED");
      console.error(error.message);

      if (reject) {
        return reject(error);
      }

      throw error;
    }
  };

  return (...args) => {
    let prereturn = undefined;

    try {
      prereturn = callback.apply(thisArg, args);
    } catch(error) {
      error instanceof Error
      && onError(error, doSuppress);
    }

    if (prereturn && prereturn.then) {
      return new Promise((resolve, reject) => {
        prereturn
          .then(resolve)
          .catch((error: Error) => {
            onError(error, doSuppress, resolve, reject);
          });
      });
    }

    return prereturn;
  };
}

interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export const doFetch = <T>(url: string, options: RequestInit = {}): Promise<TypedResponse<T>> | never => {
  return catchError(
    fetch,
    false
  )(url, options);
};

// doFetch<{ title: string }[]>("https://jsonplaceholder.typicode.com/todos")
//   .then((response) => response.json())
//   .then((result) => result);