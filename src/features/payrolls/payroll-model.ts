export type GetPayrollRequest = {
  company_branch_id: string;
  month: number;
  year: number;
}

export type CreatePayrollRequest = GetPayrollRequest;

export type UpdatePayrollRequest = {
  payroll_id: string;
  status: string;
}