import { NextResponse } from "next/server";

export interface Timesheet {
  id: string;
  weekNumber: number;
  dateRange: string;
  status: "COMPLETED" | "INCOMPLETE" | "MISSING";
}

let timesheets: Timesheet[] = [
  { id: "1", weekNumber: 1, dateRange: "1 - 5 January, 2024", status: "COMPLETED" },
  { id: "2", weekNumber: 2, dateRange: "8 - 12 January, 2024", status: "COMPLETED" },
  { id: "3", weekNumber: 3, dateRange: "15 - 19 January, 2024", status: "INCOMPLETE" },
  { id: "4", weekNumber: 4, dateRange: "22 - 26 January, 2024", status: "COMPLETED" },
  { id: "5", weekNumber: 5, dateRange: "28 January - 1 February, 2024", status: "MISSING" },
];

export async function GET() {
  return NextResponse.json(timesheets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEntry: Timesheet = {
    id: Date.now().toString(),
    weekNumber: Number(body.weekNumber),
    dateRange: body.dateRange,
    status: body.status || "INCOMPLETE",
  };
  timesheets.unshift(newEntry);
  return NextResponse.json(newEntry, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  timesheets = timesheets.map((item) =>
    item.id === body.id ? { ...item, ...body } : item
  );
  return NextResponse.json(body);
}