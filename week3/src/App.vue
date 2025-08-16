<script setup>
import Form from './components/Form.vue'
import Button from './components/Button.vue'

const onClick = () => {
  alert('Button clicked!')
}
</script>

<template>
  <Form />
  <Button
    label="Submit"
    color="primary"
    size="small"
    :disabled="true"
    style="outlined"
    @click="onClick"
  />
</template>

<style scoped>
/* add style here */
</style>
