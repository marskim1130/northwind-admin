<script setup lang="ts">
import type {
  CustomerListItem,
  CustomerListQuery,
  CustomerSortBy,
  SortOrder
} from "@northwind-admin/shared";
import { Refresh, Search, View } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchCustomers } from "../../api/customers";
import { queryKeys } from "../../api/queryKeys";

interface CustomerFilters {
  keyword: string;
  country: string;
  city: string;
}

interface SortChangeEvent {
  prop: string;
  order: "ascending" | "descending" | null;
}

const customerSortColumns: Record<string, CustomerSortBy> = {
  customerId: "customerId",
  companyName: "companyName",
  contactName: "contactName",
  country: "country",
  city: "city",
  orderCount: "orderCount",
  totalSales: "totalSales"
};

const router = useRouter();
const page = ref(1);
const pageSize = ref(20);
const sortBy = ref<CustomerSortBy>("customerId");
const sortOrder = ref<SortOrder>("asc");

function createDefaultFilters(): CustomerFilters {
  return {
    keyword: "",
    country: "",
    city: ""
  };
}

const filters = reactive<CustomerFilters>(createDefaultFilters());
const appliedFilters = reactive<CustomerFilters>(createDefaultFilters());

function copyFilters(source: CustomerFilters, target: CustomerFilters) {
  target.keyword = source.keyword;
  target.country = source.country;
  target.city = source.city;
}

const queryParams = computed<CustomerListQuery>(() => ({
  page: page.value,
  pageSize: pageSize.value,
  keyword: appliedFilters.keyword.trim() || undefined,
  country: appliedFilters.country.trim() || undefined,
  city: appliedFilters.city.trim() || undefined,
  sortBy: sortBy.value,
  sortOrder: sortOrder.value
}));

const customersQuery = useQuery({
  queryKey: computed(() => queryKeys.customers.list(queryParams.value)),
  queryFn: () => fetchCustomers(queryParams.value)
});

const customersData = computed(() => customersQuery.data.value);
const customers = computed(() => customersData.value?.items ?? []);
const total = computed(() => customersData.value?.total ?? 0);
const isLoading = computed(
  () => customersQuery.isPending.value || customersQuery.isFetching.value
);
const errorMessage = computed(() => {
  const error = customersQuery.error.value;

  return error instanceof Error ? error.message : "Customers request failed.";
});

function applyFilters() {
  copyFilters(filters, appliedFilters);
  page.value = 1;
}

function resetFilters() {
  copyFilters(createDefaultFilters(), filters);
  copyFilters(filters, appliedFilters);
  page.value = 1;
}

function handlePageChange(nextPage: number) {
  page.value = nextPage;
}

function handlePageSizeChange(nextPageSize: number) {
  pageSize.value = nextPageSize;
  page.value = 1;
}

function handleSortChange(event: SortChangeEvent) {
  sortBy.value = customerSortColumns[event.prop] ?? "customerId";
  sortOrder.value = event.order === "descending" ? "desc" : "asc";
  page.value = 1;
}

function goToCustomer(customer: CustomerListItem) {
  void router.push(`/customers/${customer.customerId}`);
}
</script>

<template>
  <section class="page customers">
    <header class="page__header">
      <div>
        <h1 class="page__title">Customers</h1>
        <p class="page__subtitle">客户目录 [Customer Directory]</p>
      </div>
    </header>

    <ElForm class="customers__filters" :model="filters" label-position="top">
      <ElFormItem label="Keyword">
        <ElInput
          v-model="filters.keyword"
          clearable
          placeholder="Company or contact"
          :prefix-icon="Search"
          @keyup.enter="applyFilters"
        />
      </ElFormItem>
      <ElFormItem label="Country">
        <ElInput
          v-model="filters.country"
          clearable
          placeholder="Germany"
          @keyup.enter="applyFilters"
        />
      </ElFormItem>
      <ElFormItem label="City">
        <ElInput
          v-model="filters.city"
          clearable
          placeholder="Berlin"
          @keyup.enter="applyFilters"
        />
      </ElFormItem>
      <ElFormItem class="customers__filter-actions" label=" ">
        <ElButton type="primary" :icon="Search" @click="applyFilters">
          Search
        </ElButton>
        <ElButton :icon="Refresh" @click="resetFilters">Reset</ElButton>
      </ElFormItem>
    </ElForm>

    <ElAlert
      v-if="customersQuery.isError.value"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ElTable
      class="customers__table"
      :data="customers"
      :loading="isLoading"
      border
      stripe
      empty-text="No customers"
      @sort-change="handleSortChange"
    >
      <ElTableColumn
        prop="customerId"
        label="ID"
        width="96"
        sortable="custom"
      />
      <ElTableColumn
        prop="companyName"
        label="Company"
        min-width="220"
        sortable="custom"
      />
      <ElTableColumn
        prop="contactName"
        label="Contact"
        min-width="170"
        sortable="custom"
      />
      <ElTableColumn
        prop="country"
        label="Country"
        min-width="140"
        sortable="custom"
      />
      <ElTableColumn prop="city" label="City" min-width="130" sortable="custom" />
      <ElTableColumn
        prop="orderCount"
        label="Orders"
        width="110"
        align="right"
        sortable="custom"
      />
      <ElTableColumn
        prop="totalSales"
        label="Total Sales"
        width="140"
        align="right"
        sortable="custom"
      >
        <template #default="{ row }">
          <span class="customers__money">{{ row.totalSales }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Actions" width="110" fixed="right">
        <template #default="{ row }">
          <ElButton
            type="primary"
            text
            :icon="View"
            @click="goToCustomer(row)"
          >
            View
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <div class="customers__pagination">
      <ElPagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
  </section>
</template>

<style scoped>
.customers {
  min-width: 0;
}

.customers__filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.5fr) repeat(2, minmax(150px, 0.8fr)) auto;
  gap: 12px;
  align-items: end;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.customers__filters :deep(.el-form-item) {
  margin-bottom: 0;
}

.customers__filter-actions :deep(.el-form-item__content) {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.customers__table {
  width: 100%;
}

.customers__money {
  font-variant-numeric: tabular-nums;
}

.customers__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 4px 0;
}

@media (max-width: 920px) {
  .customers__filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 680px) {
  .customers__filters {
    grid-template-columns: 1fr;
  }

  .customers__pagination {
    justify-content: flex-start;
    overflow-x: auto;
  }
}
</style>
