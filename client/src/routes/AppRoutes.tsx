import { Routes, Route, Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

/* Public */
import Index from "@/pages/LandingPage";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import VerifyOtp from "@/pages/auth/VerifyOtp";
// import ResendOTP from "@/pages/auth/ResendOtp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AppGate from "@/routes/AppGate";

/* KYC Pages */
import KycStart from "@/pages/kyc/KycStart";
import PersonalDetails from "@/pages/kyc/PersonalDetails";
import DocumentUpload from "@/pages/kyc/DocumentUpload";
import ReviewSubmit from "@/pages/kyc/ReviewSubmit";
import KycStatus from "@/pages/kyc/KycStatus";

/* Layouts */
import UserRoutes from "./UserRoutes";
// import AdminRoutes from "./AdminRoutes";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import KycRoute from "@/routes/KycRoute";

/* User Pages */
import UserDashboard from "@/pages/user/dashboard/UserDashboard";
import Marketplace from "@/pages/user/marketplace/Marketplace";
import UserPreferences from "@/pages/user/preferences/UserPreferences";
import PreferenceForm from "@/pages/user/preferences/PreferenceForm";
import MyInventory from "@/pages/user/inventory/MyInventory";
import InventoryDetails from "@/pages/user/inventory/InventoryDetails";
import MyListings from "@/pages/user/listings/MyListings";
import CreateListing from "@/pages/user/listings/CreateListing";
import MyBids from "@/pages/user/bids/MyBids";
import BidsOnMyListings from "@/pages/user/bids-received/BidsOnMyListings";
import BidsReceivedDetail from "@/pages/user/bids-received/components/BidsReceivedDetail";
import MarketplaceDetailPage from "@/pages/user/marketplace/MarketplaceDetailPage";
import DealsPage from "@/pages/user/deal/DealsPage";
import DealDetailPage from "@/pages/user/deal/DealDetailPage";
import PaymentsPage from "@/pages/user/payments/PaymentsPage";
import MessagesPage from "@/pages/user/chat/MessagesPage";

/* Other */
import Unauthorized from "@/pages/Unauthorized";
import InventoryForm from "@/pages/user/inventory/InventoryForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---------- PUBLIC (Unauthenticated only) ---------- */}
      <Route path="/" element={<Index />} />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerifyOtp />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ---------- OTP ROUTES (Authenticated but OTP NOT verified) ---------- */}

      {/* <Route
        path="/resend-otp"
        element={
          <ProtectedRoute>
            <ResendOTP />
          </ProtectedRoute>
        }
      /> */}

      {/* ---------- KYC ROUTES (Authenticated + OTP verified) ---------- */}
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KycRoute>
              <Outlet />
            </KycRoute>
          </ProtectedRoute>
        }
      >
        <Route path="start" element={<KycStart />} />
        <Route path="personal-details" element={<PersonalDetails />} />
        <Route path="document-upload" element={<DocumentUpload />} />
        <Route path="review-submit" element={<ReviewSubmit />} />
        <Route path="status" element={<KycStatus />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppGate>
              <Navigate to="/user" replace />
            </AppGate>
          </ProtectedRoute>
        }
      />

      {/* ---------- USER ROUTES (Dashboard, marketplace, etc.) ---------- */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <AppGate>
              <UserRoutes />
            </AppGate>
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<MarketplaceDetailPage />} />

        <Route path="preferences">
          <Route index element={<UserPreferences />} />
          <Route path="new" element={<PreferenceForm />} />
          <Route path=":id/edit" element={<PreferenceForm />} />
        </Route>

        <Route path="inventory" element={<MyInventory />} />
        <Route path="inventory/add" element={<InventoryForm />} />
        <Route path="inventory/edit/:id" element={<InventoryForm />} />
        <Route path="inventory/view/:id" element={<InventoryDetails />} />

        <Route path="listings" element={<MyListings />} />
        <Route path="listings/create" element={<CreateListing />} />
        <Route path="bids" element={<MyBids />} />
        <Route path="bids/received" element={<BidsOnMyListings />} />
        <Route
          path="bids/received/:listingId"
          element={<BidsReceivedDetail />}
        />
        <Route path="deals" element={<DealsPage />} />
        <Route path="deals/:dealId" element={<DealDetailPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="messages" element={<MessagesPage />} />

      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
