export type GetPayrollRequest = {
  company_branch_id: string;
  month: number;
  year: number;
}

export type CreatePayrollRequest = GetPayrollRequest;

export type UpdatePayrollRequest = {
  company_branch_id: string;
  payroll_id: string;
  status: string;
}

export type GetUserPayrollRequest = {
  company_branch_id: string;
  employee_id: string;
  year: number;
}