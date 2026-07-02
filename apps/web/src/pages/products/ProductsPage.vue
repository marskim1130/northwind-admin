<script setup lang="ts">
import type {
  ProductListItem,
  ProductListQuery,
  ProductSortBy,
  SortOrder
} from "@northwind-admin/shared";
import { Refresh, Search, View } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchProducts } from "../../api/products";
import { queryKeys } from "../../api/queryKeys";

type BooleanFilter = "all" | "true" | "false";

interface ProductFilters {
  keyword: string;
  categoryId?: number;
  supplierId?: number;
  discontinued: BooleanFilter;
  lowStock: BooleanFilter;
}

interface SortChangeEvent {
  prop: string;
  order: "ascending" | "descending" | null;
}

const productSortColumns: Record<string, ProductSortBy> = {
  productId: "productId",
  productName: "productName",
  categoryName: "categoryName",
  supplierName: "supplierName",
  unitPrice: "unitPrice"
};

const router = useRouter();
const page = ref(1);
const pageSize = ref(20);
const sortBy = ref<ProductSortBy>("productId");
const sortOrder = ref<SortOrder>("asc");

function createDefaultFilters(): ProductFilters {
  return {
    keyword: "",
    categoryId: undefined,
    supplierId: undefined,
    discontinued: "all",
    lowStock: "all"
  };
}

const filters = reactive<ProductFilters>(createDefaultFilters());
const appliedFilters = reactive<ProductFilters>(createDefaultFilters());

function toOptionalBoolean(value: BooleanFilter) {
  if (value === "all") {
    return undefined;
  }

  return value === "true";
}

function copyFilters(source: ProductFilters, target: ProductFilters) {
  target.keyword = source.keyword;
  target.categoryId = source.categoryId;
  target.supplierId = source.supplierId;
  target.discontinued = source.discontinued;
  target.lowStock = source.lowStock;
}

const queryParams = computed<ProductListQuery>(() => ({
  page: page.value,
  pageSize: pageSize.value,
  keyword: appliedFilters.keyword.trim() || undefined,
  categoryId: appliedFilters.categoryId,
  supplierId: appliedFilters.supplierId,
  discontinued: toOptionalBoolean(appliedFilters.discontinued),
  lowStock: toOptionalBoolean(appliedFilters.lowStock),
  sortBy: sortBy.value,
  sortOrder: sortOrder.value
}));

const productsQuery = useQuery({
  queryKey: computed(() => queryKeys.products.list(queryParams.value)),
  queryFn: () => fetchProducts(queryParams.value)
});

const productsData = computed(() => productsQuery.data.value);
const products = computed(() => productsData.value?.items ?? []);
const total = computed(() => productsData.value?.total ?? 0);
const isLoading = computed(
  () => productsQuery.isPending.value || productsQuery.isFetching.value
);
const errorMessage = computed(() => {
  const error = productsQuery.error.value;

  return error instanceof Error ? error.message : "Products request failed.";
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
  sortBy.value = productSortColumns[event.prop] ?? "productId";
  sortOrder.value = event.order === "descending" ? "desc" : "asc";
  page.value = 1;
}

function goToProduct(product: ProductListItem) {
  void router.push(`/products/${product.productId}`);
}
</script>

<template>
  <section class="page products">
    <header class="page__header">
      <div>
        <h1 class="page__title">Products</h1>
        <p class="page__subtitle">商品目录 [Product Catalog]</p>
      </div>
    </header>

    <ElForm class="products__filters" :model="filters" label-position="top">
      <ElFormItem label="Keyword">
        <ElInput
          v-model="filters.keyword"
          clearable
          placeholder="Product name"
          :prefix-icon="Search"
          @keyup.enter="applyFilters"
        />
      </ElFormItem>
      <ElFormItem label="Category">
        <ElInputNumber
          v-model="filters.categoryId"
          :min="1"
          :controls="false"
          placeholder="ID"
        />
      </ElFormItem>
      <ElFormItem label="Supplier">
        <ElInputNumber
          v-model="filters.supplierId"
          :min="1"
          :controls="false"
          placeholder="ID"
        />
      </ElFormItem>
      <ElFormItem label="Status">
        <ElSelect v-model="filters.discontinued">
          <ElOption label="All" value="all" />
          <ElOption label="Active" value="false" />
          <ElOption label="Discontinued" value="true" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="Stock">
        <ElSelect v-model="filters.lowStock">
          <ElOption label="All" value="all" />
          <ElOption label="Low stock" value="true" />
          <ElOption label="Normal" value="false" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem class="products__filter-actions" label=" ">
        <ElButton type="primary" :icon="Search" @click="applyFilters">
          Search
        </ElButton>
        <ElButton :icon="Refresh" @click="resetFilters">Reset</ElButton>
      </ElFormItem>
    </ElForm>

    <ElAlert
      v-if="productsQuery.isError.value"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ElTable
      class="products__table"
      :data="products"
      :loading="isLoading"
      border
      stripe
      empty-text="No products"
      @sort-change="handleSortChange"
    >
      <ElTableColumn prop="productId" label="ID" width="86" sortable="custom" />
      <ElTableColumn
        prop="productName"
        label="Product"
        min-width="210"
        sortable="custom"
      />
      <ElTableColumn
        prop="categoryName"
        label="Category"
        min-width="150"
        sortable="custom"
      />
      <ElTableColumn
        prop="supplierName"
        label="Supplier"
        min-width="190"
        sortable="custom"
      />
      <ElTableColumn
        prop="unitPrice"
        label="Unit Price"
        width="130"
        align="right"
        sortable="custom"
      >
        <template #default="{ row }">
          <span class="products__money">{{ row.unitPrice }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Stock" width="120">
        <template #default="{ row }">
          <ElTag :type="row.lowStock ? 'warning' : 'success'" effect="plain">
            {{ row.lowStock ? "Low" : "Normal" }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Actions" width="110" fixed="right">
        <template #default="{ row }">
          <ElButton
            type="primary"
            text
            :icon="View"
            @click="goToProduct(row)"
          >
            View
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <div class="products__pagination">
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
.products {
  min-width: 0;
}

.products__filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(4, minmax(132px, 0.8fr)) auto;
  gap: 12px;
  align-items: end;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.products__filters :deep(.el-form-item) {
  margin-bottom: 0;
}

.products__filters :deep(.el-select),
.products__filters :deep(.el-input-number) {
  width: 100%;
}

.products__filter-actions :deep(.el-form-item__content) {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.products__table {
  width: 100%;
}

.products__money {
  font-variant-numeric: tabular-nums;
}

.products__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 4px 0;
}

@media (max-width: 1180px) {
  .products__filters {
    grid-template-columns: repeat(3, minmax(160px, 1fr));
  }
}

@media (max-width: 760px) {
  .products__filters {
    grid-template-columns: 1fr;
  }

  .products__filter-actions :deep(.el-form-item__content) {
    justify-content: flex-start;
  }

  .products__pagination {
    justify-content: flex-start;
    overflow-x: auto;
  }
}
</style>
