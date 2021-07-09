import { useState, useMemo, useRef, useEffect } from 'react';
import { IUseAccumulateLoader, IUseAccumulateLoaderState, IUseAccumulateLoaderActions } from './types';

const useAccumulateLoader: IUseAccumulateLoader = () => {
  const loadersRef = useRef<IUseAccumulateLoaderState>([]);
  const [loaders, setLoaders] = useState<IUseAccumulateLoaderState>([]);

  const Loader: IUseAccumulateLoaderActions = useMemo(
    () => ({
      show: (id) => {
        if (Loader.isExist(id, true)) return;
        setLoaders((prev) => {
          const next = prev.slice();
          next.push(id);
          return next;
        });
      },
      hide: (id) => {
        if (!Loader.isExist(id, true)) return;
        setLoaders((_) => {
          const next = loadersRef.current.slice();
          const index = next.indexOf(id);
          // tslint:disable-next-line:no-bitwise
          if (~index) next.splice(index, 1);
          return next;
        });
      },
      // tslint:disable-next-line:no-bitwise
      isExist: (id, fromRef) => !!~(fromRef ? loadersRef.current : loaders).indexOf(id),
      hideAll: () => setLoaders([])
    }),
    [setLoaders, loaders]
  );

  useEffect(() => {
    loadersRef.current = loaders;
  }, [loaders]);

  return [loaders, Loader];
};

export default useAccumulateLoader;
