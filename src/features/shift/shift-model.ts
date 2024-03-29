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

export type GetShiftResponse = {
  name: string;
  start_time: string;
  end_time: string;
};
