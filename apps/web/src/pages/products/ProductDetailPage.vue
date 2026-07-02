<script setup lang="ts">
import { ArrowLeft, Goods } from "@element-plus/icons-vue";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchProduct } from "../../api/products";
import { queryKeys } from "../../api/queryKeys";

const route = useRoute();
const router = useRouter();

const productId = computed(() => Number(route.params.productId));
const isValidProductId = computed(
  () => Number.isInteger(productId.value) && productId.value > 0
);

const productQuery = useQuery({
  queryKey: computed(() => queryKeys.products.detail(productId.value)),
  queryFn: () => fetchProduct(productId.value),
  enabled: isValidProductId
});

const product = computed(() => productQuery.data.value);
const isLoading = computed(
  () => productQuery.isPending.value || productQuery.isFetching.value
);
const errorMessage = computed(() => {
  const error = productQuery.error.value;

  return error instanceof Error ? error.message : "Product request failed.";
});

function goBack() {
  void router.push("/products");
}
</script>

<template>
  <section class="page product-detail">
    <header class="page__header">
      <div class="product-detail__heading">
        <ElButton :icon="ArrowLeft" circle @click="goBack" />
        <div>
          <h1 class="page__title">
            {{ product?.productName ?? "Product Detail" }}
          </h1>
          <p class="page__subtitle">商品详情 [Product Detail]</p>
        </div>
      </div>
    </header>

    <ElAlert
      v-if="!isValidProductId"
      title="Invalid product id."
      type="error"
      show-icon
      :closable="false"
    />

    <ElAlert
      v-else-if="productQuery.isError.value"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <ElSkeleton v-else-if="isLoading" :rows="6" animated />

    <section v-else-if="product" class="product-detail__surface">
      <div class="product-detail__summary">
        <ElIcon class="product-detail__summary-icon"><Goods /></ElIcon>
        <div>
          <h2>{{ product.productName }}</h2>
          <p>{{ product.categoryName }} · {{ product.supplierName }}</p>
        </div>
        <ElTag :type="product.lowStock ? 'warning' : 'success'" effect="plain">
          {{ product.lowStock ? "Low stock" : "Normal stock" }}
        </ElTag>
      </div>

      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="Product ID">
          {{ product.productId }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Unit Price">
          <span class="product-detail__money">{{ product.unitPrice }}</span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Category">
          {{ product.categoryName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Supplier">
          {{ product.supplierName }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </section>
  </section>
</template>

<style scoped>
.product-detail {
  min-width: 0;
}

.product-detail__heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-detail__surface {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.product-detail__summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}

.product-detail__summary-icon {
  width: 42px;
  height: 42px;
  color: #0f766e;
  background: #ecfdf5;
  border-radius: 8px;
}

.product-detail__summary h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
  letter-spacing: 0;
}

.product-detail__summary p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.product-detail__money {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 680px) {
  .product-detail__summary {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .product-detail__summary :deep(.el-tag) {
    grid-column: 1 / -1;
    justify-self: flex-start;
  }
}
</style>
