import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    currentUser: {
      username: "dev-user",
      displayName: "Development User"
    },
    permissions: [] as string[]
  })
});
