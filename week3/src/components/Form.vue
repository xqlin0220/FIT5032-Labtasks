<template>
  <div>
    <h1>User Information Form / Credentials</h1>

    <form class="form" @submit.prevent="onSubmit">
      <label for="username">Username:</label><br />
      <input id="username" name="username" type="text" v-model="form.username" /><br />

      <label for="password">Password:</label><br />
      <input id="password" name="password" type="password" v-model="form.password" /><br />

      <label for="isAustralian">
        <input id="isAustralian" name="isAustralian" type="checkbox" v-model="form.isAustralian" />
        Australian Resident?
      </label><br />

      <label for="reason">Reason For Joining:</label><br />
      <textarea id="reason" name="reason" rows="3" v-model="form.reason"></textarea><br />

      <label for="gender">Gender</label><br />
      <select id="gender" name="gender" v-model="form.gender">
        <option value="" disabled>Select</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select><br /><br />

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

function onSubmit() {
  console.log('Form submitted:', { ...form })
  alert(`Submitted:\n${JSON.stringify(form, null, 2)}`)
}
</script>

<style scoped></style>
