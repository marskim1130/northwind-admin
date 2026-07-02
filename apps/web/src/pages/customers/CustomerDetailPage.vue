<script setup lang="ts">
import { ArrowLeft, OfficeBuilding } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchCustomer, fetchCustomerOrders } from "../../api/customers";
import { queryKeys } from "../../api/queryKeys";

const route = useRoute();
const router = useRouter();

const customerId = computed(() => String(route.params.customerId ?? ""));
const isValidCustomerId = computed(() => customerId.value.trim().length > 0);

const customerQuery = useQuery({
  queryKey: computed(() => queryKeys.customers.detail(customerId.value)),
  queryFn: () => fetchCustomer(customerId.value),
  enabled: isValidCustomerId
});

const ordersQuery = useQuery({
  queryKey: computed(() => queryKeys.customers.orders(customerId.value)),
  queryFn: () => fetchCustomerOrders(customerId.value),
  enabled: isValidCustomerId
});

const customer = computed(() => customerQuery.data.value);
const orders = computed(() => ordersQuery.data.value?.items ?? []);
const isLoading = computed(
  () => customerQuery.isPending.value || customerQuery.isFetching.value
);
const errorMessage = computed(() => {
  const error = customerQuery.error.value;

  return error instanceof Error ? error.message : "Customer request failed.";
});

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

function goBack() {
  void router.push("/customers");
}
</script>

<template>
  <section class="page customer-detail">
    <header class="page__header">
      <div class="customer-detail__heading">
        <ElButton :icon="ArrowLeft" circle @click="goBack" />
        <div>
          <h1 class="page__title">
            {{ customer?.companyName ?? "Customer Detail" }}
          </h1>
          <p class="page__subtitle">客户详情 [Customer Detail]</p>
        </div>
      </div>
    </header>

    <ElAlert
      v-if="!isValidCustomerId"
      title="Invalid customer id."
      type="error"
      show-icon
      :closable="false"
    />

    <ElAlert
      v-else-if="customerQuery.isError.value"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ElSkeleton v-else-if="isLoading" :rows="7" animated />

    <template v-else-if="customer">
      <section class="customer-detail__surface">
        <div class="customer-detail__summary">
          <ElIcon class="customer-detail__summary-icon"><OfficeBuilding /></ElIcon>
          <div>
            <h2>{{ customer.companyName }}</h2>
            <p>{{ customer.contactName }} · {{ customer.city }}, {{ customer.country }}</p>
          </div>
          <ElTag effect="plain">{{ customer.customerId }}</ElTag>
        </div>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="Contact">
            {{ customer.contactName }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Location">
            {{ customer.city }}, {{ customer.country }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Orders">
            {{ customer.orderCount }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Total Sales">
            <span class="customer-detail__money">{{ customer.totalSales }}</span>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Recent Order">
            {{ formatDate(customer.recentOrderDate) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </section>

      <section class="customer-detail__surface">
        <div class="customer-detail__section-header">
          <h2>Orders</h2>
          <span>{{ ordersQuery.data.value?.total ?? 0 }} total</span>
        </div>

        <ElAlert
          v-if="ordersQuery.isError.value"
          title="Customer orders request failed."
          type="error"
          show-icon
          :closable="false"
        />

        <ElTable
          v-else
          :data="orders"
          :loading="ordersQuery.isPending.value || ordersQuery.isFetching.value"
          border
          stripe
          empty-text="No orders"
        >
          <ElTableColumn prop="orderId" label="Order ID" width="120" />
          <ElTableColumn label="Order Date" min-width="160">
            <template #default="{ row }">
              {{ formatDate(row.orderDate) }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="orderTotal"
            label="Order Total"
            width="150"
            align="right"
          >
            <template #default="{ row }">
              <span class="customer-detail__money">{{ row.orderTotal }}</span>
            </template>
          </ElTableColumn>
        </ElTable>
      </section>
    </template>
  </section>
</template>

<style scoped>
.customer-detail {
  min-width: 0;
}

.customer-detail__heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-detail__surface {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.customer-detail__summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}

.customer-detail__summary-icon {
  width: 42px;
  height: 42px;
  color: #0f766e;
  background: #ecfdf5;
  border-radius: 8px;
}

.customer-detail__summary h2,
.customer-detail__section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
  letter-spacing: 0;
}

.customer-detail__summary p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.customer-detail__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.customer-detail__section-header span {
  color: #64748b;
  font-size: 13px;
}

.customer-detail__money {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 680px) {
  .customer-detail__summary {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .customer-detail__summary :deep(.el-tag) {
    grid-column: 1 / -1;
    justify-self: flex-start;
  }
}
</style>
