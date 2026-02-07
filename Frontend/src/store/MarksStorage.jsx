import { create } from "zustand";
import { persist } from "zustand/middleware";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const useMarksStore = create(
  persist(
    (set, get) => ({
      marks: [],
      loading: false,
      error: null,
      percentage: 0,
      totalMarks: 0,
      userRollNo: "", // Store roll number globally

      setRollNumber: (rollNo) => set({ userRollNo: rollNo }),

      fetchMarks: async (userMarksId) => {
        // if (get().marks.length > 0 && get().userRollNo === "241605717931") return;

        console.log("Inside fetch marks")

        set({ loading: true, error: null });
        try {
          const res = await fetch(`${VITE_BASE_URL}/student/getMarks`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMarksId }),
          });

          if (!res.ok) throw new Error("Failed to fetch marks data");

          const data = await res.json();
          const subjects = data.marks.subjects || [];
          const total = data.marks.total_marks;
          const percentage = data.percentage;

          console.log("Data from Zustand:", data);

          set({ 
            marks: subjects, 
            totalMarks: total, 
            percentage, 
            userRollNo: userMarksId, 
            loading: false 
          });
        } catch (err) {
          console.error("Error fetching marks:", err);
          set({ error: err.message, loading: false });
        }
      },

      clearMarks: () => {
        localStorage.removeItem("marks-storage"); // ✅ Explicitly remove from localStorage
        set({ marks: [], totalMarks: 0, percentage: 0, userRollNo: "" }); // ✅ Reset Zustand store
      }
    }),
    {
      name: "marks-storage",
      getStorage: () => localStorage,
    }
  )
);
