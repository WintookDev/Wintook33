<template>
  <div class="avatar-container" :style="style" aria-hidden="true">
    <slot>{{ userInitial }}</slot>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    username: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 40,
    },
  },
  computed: {
    style() {
      return {
        fontSize: `${Math.floor(this.size / 2.5)}px`,
      };
    },
    userInitial() {
      const parts = this.username.split(/[ -]/);
      let initials = parts.reduce((acc, curr) => acc + curr.charAt(0), '');

      if (initials.length > 2 && initials.search(/[A-Z]/) !== -1) {
        initials = initials.replace(/[a-z]+/g, '');
      }
      initials = initials.substring(0, 2).toUpperCase();

      return initials;
    },
  },
};
</script>

<style scoped>
@tailwind components;
@layer components {
  .avatar-color {
    background-image: linear-gradient(to top, #ac52ff 0%, #ddb8ff 100%);
  }

  .dark-avatar-color {
    background-image: linear-gradient(to top, #ddb8ff 0%, #ddb8ff 100%);
  }
}
.avatar-container {
  @apply flex leading-[100%] font-medium items-center justify-center text-center cursor-default avatar-color dark:dark-avatar-color text-woot-1000 dark:text-woot-200;
}
</style>
