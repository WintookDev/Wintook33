<template>
  <div class="flex flex-col">
    <div v-if="selectedTabIndex === 5">
      <div
        class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div class="flex items-center justify-start m-0 mx-4 flex-1">
            <img
              src="https://api-dev.wintook.com/img/wintook/logo_thumbnail.svg"
              class="p-2 h-16 w-16 mr-4"
            />
            <div>
              <h3 class="text-xl text-slate-800 dark:text-slate-100">
                {{ "Bot Eva" }}
              </h3>
              <p>
                {{ "Hola" }}
              </p>
            </div>
          </div>
          <div class="flex justify-center items-center mb-0 w-[15%]">
            <button class="button nice" ref="conectorEva">
              {{ this.estadoEva }}
            </button>
          </div>
        </div>
      </div>
      <div
        class="bg-white dark:bg-slate-800 border border-solid border-slate-75 dark:border-slate-700/50 rounded-sm mb-4 p-4"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div class="flex items-center justify-start m-0 mx-4 flex-1">
            <img
              src="https://api-dev.wintook.com/img/wintook/logo_thumbnail.svg"
              class="p-2 h-16 w-16 mr-4"
            />
            <div>
              <h3 class="text-xl text-slate-800 dark:text-slate-100">
                {{ "Bot Eva" }}
              </h3>
              <p>
                {{ "Hola" }}
              </p>
            </div>
          </div>
          <div class="flex justify-center items-center mb-0 w-[15%]">
            <button @click="conectarEva" class="button nice" ref="conectorEva">
              {{ this.estadoEva }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      currentUser: "getCurrentUser",
    }),
  },
  props: {
    selectedTabIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>