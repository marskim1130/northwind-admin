<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function enterDevelopmentMode() {
  void router.push("/dashboard");
}
</script>

<template>
  <div class="login">
    <h1>Northwind Admin</h1>
    <p>开发占位登录 [Development Placeholder Login]</p>
    <ElButton type="primary" @click="enterDevelopmentMode">进入 Dashboard</ElButton>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  width: min(360px, 100%);
  flex-direction: column;
  gap: 14px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #dbe4ea;
  border-radius: 8px;
}

.login h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 0;
}

.login p {
  margin: 0;
  color: #64748b;
}
</style>
