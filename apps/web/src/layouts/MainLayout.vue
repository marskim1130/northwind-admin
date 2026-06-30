<script setup lang="ts">
import {
  Box,
  DataAnalysis,
  Fold,
  Goods,
  Menu as MenuIcon,
  OfficeBuilding,
  Setting,
  ShoppingCart,
  UserFilled
} from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAppStore } from "../stores/app.store";

const appStore = useAppStore();
const { sidebarCollapsed } = storeToRefs(appStore);
const route = useRoute();
</script>

<template>
  <ElContainer class="layout">
    <ElAside class="layout__aside" :width="sidebarCollapsed ? '64px' : '236px'">
      <div class="layout__brand">
        <ElIcon><OfficeBuilding /></ElIcon>
        <span v-if="!sidebarCollapsed">Northwind</span>
      </div>
      <ElMenu :collapse="sidebarCollapsed" :default-active="route.path" router>
        <ElMenuItem index="/dashboard">
          <ElIcon><DataAnalysis /></ElIcon>
          <template #title>Dashboard</template>
        </ElMenuItem>
        <ElSubMenu index="sales">
          <template #title>
            <ElIcon><ShoppingCart /></ElIcon>
            <span>Sales</span>
          </template>
          <ElMenuItem index="/orders">Orders</ElMenuItem>
          <ElMenuItem index="/customers">Customers</ElMenuItem>
          <ElMenuItem index="/reports">Reports</ElMenuItem>
        </ElSubMenu>
        <ElSubMenu index="catalog">
          <template #title>
            <ElIcon><Goods /></ElIcon>
            <span>Catalog</span>
          </template>
          <ElMenuItem index="/products">Products</ElMenuItem>
          <ElMenuItem index="/categories">Categories</ElMenuItem>
          <ElMenuItem index="/suppliers">Suppliers</ElMenuItem>
        </ElSubMenu>
        <ElSubMenu index="operations">
          <template #title>
            <ElIcon><Box /></ElIcon>
            <span>Operations</span>
          </template>
          <ElMenuItem index="/employees">Employees</ElMenuItem>
          <ElMenuItem index="/shippers">Shippers</ElMenuItem>
        </ElSubMenu>
        <ElSubMenu index="system">
          <template #title>
            <ElIcon><Setting /></ElIcon>
            <span>System</span>
          </template>
          <ElMenuItem index="/system/users">Users</ElMenuItem>
          <ElMenuItem index="/system/roles">Roles</ElMenuItem>
          <ElMenuItem index="/system/audit-logs">Audit Logs</ElMenuItem>
        </ElSubMenu>
      </ElMenu>
    </ElAside>
    <ElContainer>
      <ElHeader class="layout__header">
        <ElButton :icon="sidebarCollapsed ? MenuIcon : Fold" circle @click="appStore.toggleSidebar" />
        <div class="layout__user">
          <ElIcon><UserFilled /></ElIcon>
          <span>Development User</span>
        </div>
      </ElHeader>
      <ElMain class="layout__main">
        <RouterView />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.layout__aside {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  transition: width 0.2s ease;
}

.layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 18px;
  color: #0f766e;
  font-weight: 700;
  white-space: nowrap;
}

.layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.layout__user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 14px;
}

.layout__main {
  min-height: calc(100vh - 56px);
  padding: 20px;
  background: #f6f8fb;
}
</style>
