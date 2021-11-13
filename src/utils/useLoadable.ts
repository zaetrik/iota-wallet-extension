import {
  RemoteData,
  pending,
  failure,
  success,
  initial,
} from '@devexperts/remote-data-ts';
import { EitherAsync } from 'purify-ts';
import { useEffect, useState } from 'react';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type ExtractLeft<E> = E extends EitherAsync<infer L, any> ? L : E;
type ExtractRight<E> = E extends EitherAsync<any, infer R> ? R : E;

const useLoadable = <
  T extends
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => EitherAsync<any, any>),
  R = ReturnType<T> extends Promise<Awaited<ReturnType<T>>>
    ? Awaited<ReturnType<T>>
    : ExtractRight<ReturnType<T>>,
  L = ReturnType<T> extends Promise<Awaited<ReturnType<T>>>
    ? Error
    : ExtractLeft<ReturnType<T>>
>(
  func: T,
  runOnInit = true
): [loadable: RemoteData<L, R>, fetch: () => void] => {
  const [loadable, setLoadable] = useState<RemoteData<L, R>>(
    runOnInit ? pending : initial
  );

  const fetch = () => {
    setLoadable(pending);

    const returnValue = func();

    if ((returnValue as EitherAsync<L, R>).run) {
      (returnValue as EitherAsync<L, R>)
        .ifLeft((e: any) => setLoadable(failure(e)))
        .ifRight((data) => setLoadable(success(data)))
        .run();
    } else {
      (returnValue as Promise<R>)
        .then((data) => setLoadable(success(data)))
        .catch((e) => setLoadable(failure(e)));
    }
  };

  useEffect(() => {
    if (runOnInit) {
      fetch();
    }
  }, []);

  return [loadable, fetch];
};

export default useLoadable;
