import request from "supertest";

const baseUrl = "http://localhost:3000";
const sum = (a: any, b: any) => {
  return a + b;
};

test("sum(1, 2) should return 3", () => {
  const result = sum(1, 2);
  expect(result).toBe(3);
});

describe("GET Today Attendance", () => {
  it("should return 200", async () => {
    const response = await request(baseUrl)
      .get("/attendance/today")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6ImFlOWRiNTA2LWVlMmMtNDY5Mi1hMTEzLTM5OTVlM2RhOTczMCIsImNvbXBhbnlfYnJhbmNoX2lkIjoiZGM4NzAwYjYtMzFiNS00ODE0LTk1NTktZGI0NTU2Y2VmOTViIiwicG9zaXRpb24iOiJNYW5hZ2VyIiwiY29tcGFueV9pZCI6ImRjODcwMGI2LTMxYjUtNDgxNC05NTU5LWRiNDU1NmNlZjk1YiIsImlhdCI6MTcxNTM5NDczNywiZXhwIjoxNzE1OTk5NTM3fQ.Y7yUALyvQOAgE4R1dV1dBCqKODTnzlmFSvzat0ycf-I"
      );
    expect(response.status).toBe(200);
  });
});
