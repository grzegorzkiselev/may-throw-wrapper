// export const memo = <T extends (...args: any[]) => any>(
//   callback: T,
//   hashGenerator?: HashGen
// ): (...args: Parameters<T>) => ReturnType<T> => {

interface Promise<T> {
  mayThrow<
    R,
    T extends (result: R, resolve, reject) => any,
    K extends (result: R, resolve, reject) => any
  >(
    onFullfilled: T,
    onRejected: K
  ): Promise<ReturnType<T | K>>
}