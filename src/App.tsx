import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

// Auth pages
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// App pages
import Dashboard from "@/pages/Dashboard";

// Commerce
import ProductList from "@/pages/products/ProductList";
import ProductDetail from "@/pages/products/ProductDetail";
import ProductForm from "@/pages/products/ProductForm";
import CategoryList from "@/pages/products/CategoryList";
import SubcategoryList from "@/pages/products/SubcategoryList";
import CollectionList from "@/pages/products/CollectionList";
import AttributeList from "@/pages/products/AttributeList";
import VariantList from "@/pages/products/VariantList";
import PackSizeList from "@/pages/products/PackSizeList";
import ImportJobList from "@/pages/products/ImportJobList";
import OrderList from "@/pages/orders/OrderList";
import OrderDetail from "@/pages/orders/OrderDetail";
import CartList from "@/pages/orders/CartList";
import AbandonedCartList from "@/pages/orders/AbandonedCartList";
import PaymentList from "@/pages/orders/PaymentList";
import CreditAccountList from "@/pages/orders/CreditAccountList";
import DocumentDeliveryLogList from "@/pages/orders/DocumentDeliveryLogList";
import CustomerInvoiceList from "@/pages/commerce/CustomerInvoiceList";

// Procurement
import SupplierList from "@/pages/procurement/SupplierList";
import PurchaseOrderList from "@/pages/procurement/PurchaseOrderList";
import PurchaseOrderForm from "@/pages/procurement/PurchaseOrderForm";
import SupplierInvoiceList from "@/pages/procurement/SupplierInvoiceList";
import GoodsReceiptList from "@/pages/procurement/GoodsReceiptList";

// Commerce / Finance
import CommerceAccounting from "@/pages/commerce/CommerceAccounting";
import GLAccountList from "@/pages/finance/GLAccountList";
import JournalEntryList from "@/pages/finance/JournalEntryList";

// Warehouse
import StockAdjustmentList from "@/pages/warehouse/StockAdjustmentList";
import DepotList from "@/pages/warehouse/DepotList";
import DepotDetail from "@/pages/warehouse/DepotDetail";
import StockOverview from "@/pages/warehouse/StockOverview";
import DepotZoneList from "@/pages/warehouse/DepotZoneList";
import StorageBinList from "@/pages/warehouse/StorageBinList";
import InventoryBatchList from "@/pages/warehouse/InventoryBatchList";
import StockMovementList from "@/pages/warehouse/StockMovementList";
import StockTransferList from "@/pages/warehouse/StockTransferList";
import PickWaveList from "@/pages/warehouse/PickWaveList";
import PickTaskList from "@/pages/warehouse/PickTaskList";
import FulfillmentBatchList from "@/pages/warehouse/FulfillmentBatchList";
import ShipmentPackageList from "@/pages/warehouse/ShipmentPackageList";

// Training
import CourseList from "@/pages/courses/CourseList";
import CourseDetail from "@/pages/courses/CourseDetail";
import CourseForm from "@/pages/courses/CourseForm";
import CourseCategoryList from "@/pages/courses/CourseCategoryList";
import ModuleList from "@/pages/courses/ModuleList";
import LessonList from "@/pages/courses/LessonList";
import LessonDetail from "@/pages/courses/LessonDetail";
import EnrollmentList from "@/pages/courses/EnrollmentList";
import CertificateList from "@/pages/courses/CertificateList";
import SubscriptionPlanList from "@/pages/courses/SubscriptionPlanList";

// Farm Management
import FarmList from "@/pages/farms/FarmList";
import FarmDetail from "@/pages/farms/FarmDetail";
import FieldList from "@/pages/farms/FieldList";
import SoilTestList from "@/pages/farms/SoilTestList";
import PlantingRecordList from "@/pages/farms/PlantingRecordList";
import HarvestRecordList from "@/pages/farms/HarvestRecordList";
import CropRecommendationList from "@/pages/farms/CropRecommendationList";
import FarmActivityList from "@/pages/farms/FarmActivityList";

// Advisor
import AdvisorChat from "@/pages/advisor/AdvisorChat";
import KnowledgeBase from "@/pages/advisor/KnowledgeBase";
import ConversationList from "@/pages/advisor/ConversationList";
import AdvisorProfileList from "@/pages/advisor/AdvisorProfileList";
import KnowledgeSourceList from "@/pages/advisor/KnowledgeSourceList";
import KnowledgeDocumentList from "@/pages/advisor/KnowledgeDocumentList";

// Agronomy
import AgronomyDashboard from "@/pages/agronomy/AgronomyDashboard";
import FertiliserPlanner from "@/pages/agronomy/FertiliserPlanner";
import LimeCalculator from "@/pages/agronomy/LimeCalculator";
import SprayProgramList from "@/pages/agronomy/SprayProgramList";
import CropCalendarList from "@/pages/agronomy/CropCalendarList";
import YieldEstimatorList from "@/pages/agronomy/YieldEstimatorList";
import IrrigationPlannerList from "@/pages/agronomy/IrrigationPlannerList";

// Logistics
import DeliveryRequestList from "@/pages/orders/DeliveryRequestList";
import DeliveryStatusList from "@/pages/logistics/DeliveryStatusList";

// System
import NotificationList from "@/pages/notifications/NotificationList";
import NotificationPreferences from "@/pages/notifications/NotificationPreferences";
import SystemSettings from "@/pages/settings/SystemSettings";
import PaymentGateways from "@/pages/settings/PaymentGateways";
import ProfileSettings from "@/pages/settings/ProfileSettings";
import UserList from "@/pages/system/UserList";
import RoleList from "@/pages/system/RoleList";
import PermissionList from "@/pages/system/PermissionList";
import OrganizationList from "@/pages/system/OrganizationList";
import SalesAnalytics from "@/pages/reports/SalesAnalytics";
import InventorySnapshot from "@/pages/reports/InventorySnapshot";
import FinanceSummary from "@/pages/reports/FinanceSummary";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected app routes */}
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />

              {/* Commerce */}
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="subcategories" element={<SubcategoryList />} />
              <Route path="collections" element={<CollectionList />} />
              <Route path="attributes" element={<AttributeList />} />
              <Route path="variants" element={<VariantList />} />
              <Route path="pack-sizes" element={<PackSizeList />} />
              <Route path="import-jobs" element={<ImportJobList />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="carts" element={<CartList />} />
              <Route path="abandoned-carts" element={<AbandonedCartList />} />
              <Route path="payments" element={<PaymentList />} />
              <Route path="credit-accounts" element={<CreditAccountList />} />
              <Route path="document-delivery-logs" element={<DocumentDeliveryLogList />} />
              <Route path="customer-invoices" element={<CustomerInvoiceList />} />
              <Route path="suppliers" element={<SupplierList />} />
              <Route path="purchase-orders" element={<PurchaseOrderList />} />
              <Route path="purchase-orders/new" element={<PurchaseOrderForm />} />
              <Route path="purchase-orders/:id/edit" element={<PurchaseOrderForm />} />
              <Route path="supplier-invoices" element={<SupplierInvoiceList />} />
              <Route path="goods-receipts" element={<GoodsReceiptList />} />
              <Route path="commerce-accounting" element={<CommerceAccounting />} />
              <Route path="gl-accounts" element={<GLAccountList />} />
              <Route path="journal-entries" element={<JournalEntryList />} />
              <Route path="stock-adjustments" element={<StockAdjustmentList />} />

              {/* Warehouse */}
              <Route path="depots" element={<DepotList />} />
              <Route path="depot-zones" element={<DepotZoneList />} />
              <Route path="storage-bins" element={<StorageBinList />} />
              <Route path="inventory-batches" element={<InventoryBatchList />} />
              <Route path="stock-movements" element={<StockMovementList />} />
              <Route path="stock-transfers" element={<StockTransferList />} />
              <Route path="pick-waves" element={<PickWaveList />} />
              <Route path="pick-tasks" element={<PickTaskList />} />
              <Route path="fulfillment-batches" element={<FulfillmentBatchList />} />
              <Route path="shipment-packages" element={<ShipmentPackageList />} />

              {/* Training */}
              <Route path="courses" element={<CourseList />} />
              <Route path="courses/new" element={<CourseForm />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="courses/:id/edit" element={<CourseForm />} />
              <Route path="course-categories" element={<CourseCategoryList />} />
              <Route path="modules" element={<ModuleList />} />
              <Route path="lessons" element={<LessonList />} />
              <Route path="lessons/:id" element={<LessonDetail />} />
              <Route path="enrollments" element={<EnrollmentList />} />
              <Route path="certificates" element={<CertificateList />} />
              <Route path="subscription-plans" element={<SubscriptionPlanList />} />

              {/* Farm Management */}
              <Route path="farms" element={<FarmList />} />
              <Route path="farms/:id" element={<FarmDetail />} />
              <Route path="fields" element={<FieldList />} />
              <Route path="planting-records" element={<PlantingRecordList />} />
              <Route path="harvest-records" element={<HarvestRecordList />} />
              <Route path="soil-tests" element={<SoilTestList />} />
              <Route path="crop-recommendations" element={<CropRecommendationList />} />
              <Route path="farm-activities" element={<FarmActivityList />} />

              {/* Seedlink Advisor */}
              <Route path="advisor/chat" element={<AdvisorChat />} />
              <Route path="advisor/knowledge" element={<KnowledgeBase />} />
              <Route path="advisor/conversations" element={<ConversationList />} />
              <Route path="advisor/profiles" element={<AdvisorProfileList />} />
              <Route path="advisor/sources" element={<KnowledgeSourceList />} />
              <Route path="advisor/documents" element={<KnowledgeDocumentList />} />

              {/* Agronomy */}
              <Route path="agronomy" element={<AgronomyDashboard />} />
              <Route path="agronomy/fertiliser" element={<FertiliserPlanner />} />
              <Route path="agronomy/lime" element={<LimeCalculator />} />
              <Route path="agronomy/spray" element={<SprayProgramList />} />
              <Route path="agronomy/calendar" element={<CropCalendarList />} />
              <Route path="agronomy/yield" element={<YieldEstimatorList />} />
              <Route path="agronomy/irrigation" element={<IrrigationPlannerList />} />

              {/* Logistics */}
              <Route path="delivery-requests" element={<DeliveryRequestList />} />
              <Route path="delivery-status" element={<DeliveryStatusList />} />

              {/* System */}
              <Route path="notifications" element={<NotificationList />} />
              <Route path="notifications/preferences" element={<NotificationPreferences />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="settings/payment-gateways" element={<PaymentGateways />} />
              <Route path="settings/profile" element={<ProfileSettings />} />
              <Route path="users" element={<UserList />} />
              <Route path="roles" element={<RoleList />} />
              <Route path="permissions" element={<PermissionList />} />
              <Route path="organizations" element={<OrganizationList />} />

              {/* Reports */}
              <Route path="reports/sales" element={<SalesAnalytics />} />
              <Route path="reports/inventory" element={<InventorySnapshot />} />
              <Route path="reports/finance" element={<FinanceSummary />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
