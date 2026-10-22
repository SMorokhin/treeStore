<template>
    <span class="ui-spin" :class="{
        'ui-spin--overlapping': overlapping,
    }" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const SPIN_SIZE = {
    sm: 24,
    lg: 48,
} as const;

defineOptions({
    name: 'ui-spin',
});

const props = withDefaults(defineProps<{
    size?: keyof typeof SPIN_SIZE;
    overlapping?: boolean;
}>(), {
    size: 'sm',
    overlapping: false,
});

const size = computed(() => {
    return SPIN_SIZE[props.size];
});
</script>

<style lang="scss">
.ui-spin {
    --color-1: #00aeff;
    --color-2: #ff3d00;
    --size: 1px;

    width: calc(v-bind('size') * var(--size));
    height: calc(v-bind('size') * var(--size));
    border: calc(5 * var(--size)) solid var(--color-1);
    border-bottom-color: var(--color-2);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: spin-rotation 1s linear infinite;

    &--overlapping {
        position: absolute;
        left: calc(50% - calc(v-bind('size') / 2 * var(--size)));
        top: calc(50% - calc(v-bind('size') / 2 * var(--size)));
    }
}

@keyframes spin-rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>