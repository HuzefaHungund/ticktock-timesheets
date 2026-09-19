"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Timesheet } from "@/app/api/timesheets/route";
import TimesheetModal from "@/components/TimesheetModal";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Timesheet | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update" | "view">("view");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTimesheets();
    }
  }, [status, router]);

  const fetchTimesheets = async () => {
    try {
      const res = await fetch("/api/timesheets");
      const data = await res.json();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets:", err);
    }
  };

  const handleSave = async (entry: Partial<Timesheet>) => {
    const method = entry.id ? "PUT" : "POST";
    await fetch("/api/timesheets", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    fetchTimesheets();
  };

  const openModal = (mode: "create" | "update" | "view", item?: Timesheet) => {
    setModalMode(mode);
    setActiveItem(item || null);
    setIsModalOpen(true);
  };


  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((t) => {
      if (selectedStatus === "ALL") return true;
      return t.status === selectedStatus;
    });
  }, [timesheets, selectedStatus]);


  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredTimesheets.length / itemsPerPage));

  const paginatedTimesheets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTimesheets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTimesheets, currentPage, itemsPerPage]);

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-sm">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex flex-col">
      <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-8">
        <div className="flex items-center space-x-8">
          <span className="text-xl font-bold tracking-tight text-black">ticktock</span>
          <span className="text-sm text-gray-500 font-medium">Timesheets</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => openModal("create")}
            className="rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            + New Timesheet
          </button>
          <div
            className="flex items-center space-x-2 cursor-pointer border-l border-gray-200 pl-4"
            onClick={() => signOut()}
            title="Click to sign out"
          >
            <span className="text-sm font-medium text-gray-800">
              Logout
            </span>
            
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1200px] w-full mx-auto space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <h1 className="text-xl font-bold text-gray-900">Your Timesheets</h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="INCOMPLETE">INCOMPLETE</option>
                <option value="MISSING">MISSING</option>
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F9FAFB] text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                <tr>
                  <th className="py-3 px-4">WEEK #</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-gray-600">
                {paginatedTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                      No timesheets found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTimesheets.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50">
                      <td className="py-4 px-4 text-gray-800 font-medium">{row.weekNumber}</td>
                      <td className="py-4 px-4 text-gray-500">{row.dateRange}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                            row.status === "COMPLETED"
                              ? "bg-[#D1FADF] text-[#027A48]"
                              : row.status === "INCOMPLETE"
                              ? "bg-[#FEF0C7] text-[#B54708]"
                              : "bg-[#FEE4E2] text-[#B42318]"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {row.status === "COMPLETED" && (
                          <button
                            onClick={() => openModal("view", row)}
                            className="text-[#2563EB] hover:underline"
                          >
                            View
                          </button>
                        )}
                        {row.status === "INCOMPLETE" && (
                          <button
                            onClick={() => openModal("update", row)}
                            className="text-[#2563EB] hover:underline"
                          >
                            Update
                          </button>
                        )}
                        {row.status === "MISSING" && (
                          <button
                            onClick={() => openModal("create", row)}
                            className="text-[#2563EB] hover:underline"
                          >
                            Create
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-7 text-xs text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
              <svg className="pointer-events-none absolute right-2 top-2.5 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center rounded-lg border border-gray-200 bg-white text-xs text-gray-600 divide-x divide-gray-200 overflow-hidden">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-blue-50 text-[#2563EB] font-semibold"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
          © 2024 tentwenty. All rights reserved.
        </div>
      </main>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={activeItem}
        mode={modalMode}
      />
    </div>
  );
}