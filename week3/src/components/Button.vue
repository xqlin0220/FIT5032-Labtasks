<!-- // challenge 1
<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

// defineProps for button properties
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary' // default color
  },
  size: {
    type: String,
    default: 'medium', // default size
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  style: {
    type: String,
    default: 'filled', // default style
    validator: (val) => ['outlined', 'filled'].includes(val)
  }
})

// defineEmits for button click event
const emit = defineEmits(['click'])

// handleClick function to emit click event
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

// computed property to determine the button class based on props
const buttonClass = computed(() => {
  let classes = ['btn'] // Bootstrap 按钮基类

  // determine color class
  if (props.style === 'outlined') {
    classes.push(`btn-outline-${props.color}`)
  } else {
    classes.push(`btn-${props.color}`)
  }

  // determine size class
  if (props.size === 'small') {
    classes.push('btn-sm')
  } else if (props.size === 'large') {
    classes.push('btn-lg')
  }

  return classes
})
</script> -->


<!-- // challenge 2 -->
<template>
  <button
    :style="buttonStyle"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
  <div style="padding:24px; display: grid; gap: 12px; max-width: 360px;">
    <Button label="Prime Button" icon="pi pi-check" />
    <InputText v-model="name" placeholder="Your name" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const name = ref('')

const props = defineProps({
  label: { type: String, required: true },
  color: { type: String, default: 'primary' }, // 'primary', 'success', 'danger'...
  size: { type: String, default: 'medium' },   // 'small', 'medium', 'large'
  disabled: { type: Boolean, default: false },
  style: { type: String, default: 'filled' }   // 'outlined' or 'filled'
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

// define color mapping
const colors = {
  primary: '#0d6efd',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  secondary: '#6c757d'
}

// computed property to generate button styles
const buttonStyle = computed(() => {
  const baseColor = colors[props.color] || colors.primary

  // define size mapping
  const sizeMap = {
    small: '5px 10px',
    medium: '8px 16px',
    large: '12px 24px'
  }

  // select size based on props
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
