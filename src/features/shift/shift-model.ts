export type AddShiftRequest = {
  employee_id: string;
  start_time: string;
  end_time: string;
};

export type AddShiftResponse = AddShiftRequest;

export type DeleteShiftRequest = {
  shift_id: number;
};

export type DeleteShiftResponse = AddShiftResponse;

export type UpdateShiftRequest = {
  shift_id: number;
  employee_id: string;
  start_time: string;
  end_time: string;
};

export type UpdateShiftResponse = AddShiftResponse;

export type GetShiftEmployeeRequest = {
  employee_id: string;
};

export type GetShiftEmployeeResponse = AddShiftResponse;

export type GetAllShiftRequest = {
  company_branch_id: string;
};
export type GetAllShiftResponse = AddShiftResponse[];
