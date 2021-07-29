import { useState } from 'react';

export interface IUseItemsSelectionActions<T> {
  selectOne: (item: T) => void;
  deselectOne: (item: T) => void;
  forceSelectOne: (item: T) => void;
  deselectAll: () => void;
  selectAllOf: (items: T[]) => void;
  deselectAllOf: (items: T[]) => void;
  replaceOne: (item: T) => void;
  replaceAllWith: (items: T[]) => void;
}

export type IUseItemsSelection<T> = (defaultValue?: T[]) => [T[], IUseItemsSelectionActions<T>];

/**
 * @description actions to change selected items differently
 *
 * @method selectOne(item) - select item in anyway
 * @method deselectOne(item) - deselect item in anyway
 * @method forceSelectOne(item) - select item if is does not exist or deselect item if is exist
 * @method deselectAll() - deselect all items
 * @method selectAllOf(items) - select multiple items in anyway
 * @method deselectAllOf(items) - deselect mupltiple items in anyway
 * @method replaceOne(item) - select only this item and deselect other items
 * @method replaceAllWith(items) - select only these items and deselect other items
 *
 * @using_1 ``` const [selectedItems, selectedActions] = useItemsSelection<string>() ```
 * @using_2 ``` const [selectedItems, selectedActions] = useItemsSelection<number>() ```
 * @using_3 ``` const [selectedItems, selectedActions] = useItemsSelection<number>([1, 2, 3, 4, 5]) ```
 */

export const useItemsSelection = <T = any>(defaultValue: T[] = []): ReturnType<IUseItemsSelection<T>> => {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultValue);

  const actions: IUseItemsSelectionActions<T> = {
    selectOne: (item) => {
      setSelectedItems((prev) => {
        const next = prev.slice();
        if (!next.includes(item)) next.push(item);
        return next;
      });
    },
    deselectOne: (item) => {
      setSelectedItems((prev) => {
        const next = prev.slice();
        const index = next.indexOf(item);
        // tslint:disable-next-line:no-bitwise
        if (~index) next.splice(index, 1);
        return next;
      });
    },
    forceSelectOne: (item) => {
      setSelectedItems((prev) => {
        const next = prev.slice();
        const index = next.indexOf(item);
        // tslint:disable-next-line:no-bitwise
        if (~index) next.splice(index, 1);
        else next.push(item);
        return next;
      });
    },
    deselectAll: () => setSelectedItems([]),
    selectAllOf: (items) => {
      setSelectedItems((prev) => {
        const next = prev.slice().concat(items);

        // return unique items
        return [...Array.from(new Set(next))];
      });
    },
    deselectAllOf: (items) => {
      setSelectedItems((prev) => {
        const next = prev.slice();
        const filtered = next.filter((item) => !items.includes(item));
        return filtered;
      });
    },
    replaceOne: (item) => setSelectedItems([item]),
    replaceAllWith: (items) => setSelectedItems(items)
  };

  return [selectedItems, actions];
};
