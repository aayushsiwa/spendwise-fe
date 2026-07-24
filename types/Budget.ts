export interface Budget {
  ID: string;
  categoryID: string;
  category: string;
  month: number;
  year: number;
  amount: number;
}

export interface BudgetProgress extends Budget {
  spent: number;
  percentage: number;
}
