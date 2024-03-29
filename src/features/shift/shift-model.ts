export type AddShiftRequest = {
  company_branch_id: string;
  name: string;
  start_time: string;
  end_time: string;
};
export type AddShiftResponse = AddShiftRequest;

export type DeleteShiftRequest = {
  shift_id: number;
};

export type DeleteShiftResponse = AddShiftResponse;

export type GetShiftRequest = {
  company_branch_id: string;
};

export type GetShiftResponse = AddShiftResponse;

export type AddAssignShiftRequest = {
  shift_id: number;
  employee_id: string;
  company_branch_id: string;
};

export type AddAssignShiftResponse = AddAssignShiftRequest;

export type UpdateAssignShiftRequest = AddAssignShiftRequest;

export type UpdateAssignShiftResponse = UpdateAssignShiftRequest;

export type GetAllAsignShiftRequest = {
  company_branch_id: string;
};
export type GetAllAsignShiftResponse = {
  assign_shift_id: number;
  shift: { name: string; start_time: string; end_time: string };
  employee: {
    first_name: string;
    last_name: string;
  };
};
