// app/(dashboard)/layout.jsx
// This layout intentionally passes children through with zero constraints.
// The student/mentor dashboards manage their own full-viewport sidebar layouts.
// Adding max-w, py-10, or any wrapper here breaks the fixed sidebar design.

export default function DashboardLayout({ children }) {
  return <>{children}</>
}