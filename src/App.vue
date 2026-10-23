<template>
  <div class="application">
    <h1>Application header</h1>

    <div class="application__content">
      <tree-table />
    </div>
  </div>
</template>

<script setup lang="ts">
import TreeTable from '~/components/table/table.vue';
</script>

<style lang="scss">
.application {
  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
  }
}
</style>
