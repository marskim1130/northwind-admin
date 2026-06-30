<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => String(route.meta.title ?? "Reserved Module"));
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">{{ title }}</h1>
        <p class="page__subtitle">预留模块 [Reserved Module]</p>
      </div>
    </header>
    <ElEmpty description="该读路径将在后续 Issue 中实现" />
  </section>
</template>
