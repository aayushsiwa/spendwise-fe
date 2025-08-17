export type CategoryExpense = {
  category_id: number;
  category: string;
  amount: number;
};

export type CategoryIncome = {
  category_id: number;
  category: string;
  amount: number;
};

export type SummaryMonth = {
  expenses: CategoryExpense[];
  incomes: CategoryIncome[];
  net: number;
  opening: number;
  closing: number;
  total_expenses: number;
  total_income: number;
};
