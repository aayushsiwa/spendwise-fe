import { FC, createContext, useContext } from 'react';

import { Category } from '@/types/Categories';

import { useCategoriesProvider } from './Categories.hooks';

export type TCategoriesContext = {
  categories?: Category[];
  getCategoryColor: (categoryName: string) => string;
  isGetCategoriesSuccess?: boolean;
  isGetCategoriesLoading?: boolean;
  isGetCategoriesError?: boolean;
  // updateCategry: ReturnType<typeof useUpdateCategry>;
  // deleteCa: ReturnType<typeof useDeleteRecord>;
};

export const CategoriesContext = createContext<TCategoriesContext>(
  {} as unknown as TCategoriesContext
);

export const CategoriesContextProvider: FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const {
    categories,
    getCategoryColor,
    isGetCategoriesSuccess,
    isGetCategoriesLoading,
    isGetCategoriesError,
  } = useCategoriesProvider();
  // const updateCategory = useUpdateCategory();
  // const deleteCategory = useDeleteCategory();

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        getCategoryColor,
        isGetCategoriesSuccess,
        isGetCategoriesLoading,
        isGetCategoriesError,
        // updateCategory,
        // deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = (): TCategoriesContext =>
  useContext(CategoriesContext);
