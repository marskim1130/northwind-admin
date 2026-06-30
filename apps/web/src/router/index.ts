import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import DashboardPage from "../pages/dashboard/DashboardPage.vue";
import LoginPage from "../pages/login/LoginPage.vue";
import PlaceholderPage from "../pages/placeholder/PlaceholderPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LoginPage
    },
    {
      path: "/",
      component: MainLayout,
      redirect: "/dashboard",
      children: [
        { path: "dashboard", component: DashboardPage },
        { path: "products", component: PlaceholderPage, meta: { title: "Products" } },
        { path: "products/:productId", component: PlaceholderPage, meta: { title: "Product Detail" } },
        { path: "categories", component: PlaceholderPage, meta: { title: "Categories" } },
        { path: "categories/:categoryId", component: PlaceholderPage, meta: { title: "Category Detail" } },
        { path: "suppliers", component: PlaceholderPage, meta: { title: "Suppliers" } },
        { path: "suppliers/:supplierId", component: PlaceholderPage, meta: { title: "Supplier Detail" } },
        { path: "customers", component: PlaceholderPage, meta: { title: "Customers" } },
        { path: "customers/:customerId", component: PlaceholderPage, meta: { title: "Customer Detail" } },
        { path: "orders", component: PlaceholderPage, meta: { title: "Orders" } },
        { path: "orders/:orderId", component: PlaceholderPage, meta: { title: "Order Detail" } },
        { path: "employees", component: PlaceholderPage, meta: { title: "Employees" } },
        { path: "employees/:employeeId", component: PlaceholderPage, meta: { title: "Employee Detail" } },
        { path: "shippers", component: PlaceholderPage, meta: { title: "Shippers" } },
        { path: "shippers/:shipperId", component: PlaceholderPage, meta: { title: "Shipper Detail" } },
        { path: "reports", component: PlaceholderPage, meta: { title: "Reports" } },
        { path: "reports/sales", component: PlaceholderPage, meta: { title: "Sales Reports" } },
        { path: "reports/products", component: PlaceholderPage, meta: { title: "Product Reports" } },
        { path: "reports/customers", component: PlaceholderPage, meta: { title: "Customer Reports" } },
        { path: "reports/categories", component: PlaceholderPage, meta: { title: "Category Reports" } },
        { path: "reports/employees", component: PlaceholderPage, meta: { title: "Employee Reports" } },
        { path: "system/users", component: PlaceholderPage, meta: { title: "Users" } },
        { path: "system/roles", component: PlaceholderPage, meta: { title: "Roles" } },
        { path: "system/audit-logs", component: PlaceholderPage, meta: { title: "Audit Logs" } }
      ]
    }
  ]
});
