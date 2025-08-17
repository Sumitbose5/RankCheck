import { Home } from "./auth/Home"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Login } from "./auth/Login"
import { Signup } from "./auth/Signup"
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from "./utils/ProtectedRoute"
import { ProtectedLayout } from "./layout/ProtectedLayout"
import { Dashboard } from "./student/Dashboard"
import { Leaderboard } from "./student/Leaderboard"
import { Compare } from "./student/Compare"
import { OTP } from "./auth/OTP"
import { SettingUp } from "./student/SettingUp"
import { Providers } from "./utils/Provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminRoute } from "./utils/AdminRoute"
import { AdminLayout } from "./layout/AdminLayout"
import { MarksControl } from "./admin/MarksControl"
import { UserControl } from "./admin/UserControl"
import { CmpResult } from "./student/CmpResult"
import { NotFound } from "./extras/NotFound"
import { ResetPassword } from "./auth/ResetPswd"
import { ResetPasswordOTP } from "./auth/ResetPswdOTP"
import { ChangePassword } from "./auth/ChangePswd"
import { ErrorPage } from "./extras/ErrorPage"
import OverallMarks from "./student/OverallMarks"

export const App = () => {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Providers>
          <Toaster position="top-center" reverseOrder={false} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-email" element={<OTP />} />
            <Route path="reset-pswd" element={<ResetPassword />} />
            <Route path="reset-pswd-otp" element={<ResetPasswordOTP />} />
            <Route path="/change-pswd" element={<ChangePassword />} />

            {/* Student Routes  */}
            <Route
              path="student"
              element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
              errorElement={<ErrorPage />} // Add error handling
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="compare" element={<Compare />} />
              <Route path="setup" element={<SettingUp />} />
              <Route path="compare-result" element={<CmpResult />} />
              <Route path="not-found" element={<NotFound />} />
              <Route path="overall-marks" element={<OverallMarks />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
              errorElement={<ErrorPage />} // Add error handling
            >
              <Route path="marks-control" element={<MarksControl />} />
              <Route path="user-control" element={<UserControl />} />
            </Route>

            {/* Catch-All Route for 404 Errors */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Providers>
      </Router>
    </QueryClientProvider>
  )
}
