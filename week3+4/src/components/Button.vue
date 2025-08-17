<!-- src/components/Button.vue -->
<template>
  <button
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'medium' },
  disabled: { type: Boolean, default: false },
  style: { type: String, default: 'filled' }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const colors = {
  primary: '#0d6efd',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  secondary: '#6c757d'
}

const buttonStyle = computed(() => {
  const baseColor = colors[props.color] || colors.primary
  const sizeMap = {
    small: '5px 10px',
    medium: '8px 16px',
    large: '12px 24px'
  }

  if (props.style === 'outlined') {
    return {
      backgroundColor: 'transparent',
      border: `2px solid ${baseColor}`,
      color: baseColor,
      padding: sizeMap[props.size],
      borderRadius: '6px',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.6 : 1
    }
  } else {
    return {
      backgroundColor: baseColor,
      border: 'none',
      color: 'white',
      padding: sizeMap[props.size],
      borderRadius: '6px',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.6 : 1
    }
  }
})
</script>
