export type CategoryDetail = {
  category_id: number;
  category: string;
  amount: number;
};

export type SummaryMonth = {
  expenses: CategoryDetail[];
  incomes: CategoryDetail[];
  net: number;
  opening: number;
  closing: number;
  total_expense: number;
  total_income: number;
};
