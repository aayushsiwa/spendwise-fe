export type CategoryDetail = {
  categoryID: string;
  category: string;
  amount: number;
};

export type SummaryMonth = {
  expenses: CategoryDetail[];
  incomes: CategoryDetail[];
  net: number;
  opening: number;
  closing: number;
  totalExpense: number;
  totalIncome: number;
};
