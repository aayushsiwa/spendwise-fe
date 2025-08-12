import { useGetCategoriesAPI } from "@/pages/api/categories/getCategories";
import { TCategoriesContext } from "./Categories";

export const useCategoriesProvider = (): TCategoriesContext => {
  const {
    data: getCategoriesResponse,
    isLoading: isGetCategoriesLoading,
    isError: isGetCategoriesError,
    isSuccess: isGetCategoriesSuccess,
  } = useGetCategoriesAPI();

  const getCategoryColor = (categoryName: string): string => {
    const category = getCategoriesResponse?.data.categories?.find(
      (cat) => cat.name === categoryName
    );
    return category?.color ?? "#B0BEC5";
  };

  return {
    categories: getCategoriesResponse?.data.categories,
    getCategoryColor,
    isGetCategoriesSuccess,
    isGetCategoriesLoading,
    isGetCategoriesError,
  };
};
