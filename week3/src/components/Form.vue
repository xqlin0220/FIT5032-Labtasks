<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form</h1>

        <form @submit.prevent="submitForm">
          <!-- Row: Username and Password -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="validateName(true)"
                @input="errors.username && validateName(false)"
              />
              <div v-if="errors.username" class="text-danger">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="validatePassword(true)"
                @input="errors.password && validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger">
                {{ errors.password }}
              </div>
            </div>
          </div>

          <!-- Row: Checkbox and Dropdown -->
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  @blur="validateResident(true)"
                  @change="errors.isAustralian && validateResident(false)"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>
              <div v-if="errors.isAustralian" class="text-danger">
                {{ errors.isAustralian }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                v-model="formData.gender"
                @blur="validateGender(true)"
                @change="errors.gender && validateGender(false)"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- Textarea: Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @blur="validateReason(true)"
              @input="errors.reason && validateReason(false)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger">
              {{ errors.reason }}
            </div>
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

          <!-- Submitted cards
          <div class="row mt-5" v-if="submittedCards.length">
            <div class="row g-3">
              <div
                class="col-12 col-md-6 col-lg-4"
                v-for="(card, index) in submittedCards"
                :key="index"
              >
                <div class="card h-100">
                  <div class="card-header">User Information</div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">Username: {{ card.username }}</li>
                    <li class="list-group-item">Password: {{ card.password }}</li>
                    <li class="list-group-item">
                      Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
                    </li>
                    <li class="list-group-item">Gender: {{ card.gender }}</li>
                    <li class="list-group-item">Reason: {{ card.reason }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div> -->
          <!-- PrimeVue DataTable -->
          <div class="d-flex justify-content-center mt-4" v-if="submittedCards.length">
            <DataTable :value="submittedCards" class="mt-2">
              <Column field="username" header="Username" />
              <Column field="password" header="Password" />
              <Column header="Australian Resident">
                <template #body="{ data }">
                  {{ data.isAustralian ? 'Yes' : 'No' }}
                </template>
              </Column>
              <Column field="gender" header="Gender" />
              <Column field="reason" header="Reason" />
            </DataTable>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  isAustralian: null,
  reason: null,
  gender: null,
})

// Validation functions
const validateName = (blur) => {
  const v = formData.value.username.trim()
  if (!v || v.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
    return false
  } else {
    errors.value.username = null
    return true
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUpperCase   = /[A-Z]/.test(password)
  const hasLowerCase   = /[a-z]/.test(password)
  const hasNumber      = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
    return false
  } else if (!hasUpperCase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
    return false
  } else if (!hasLowerCase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
    return false
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
    return false
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
    return false
  } else {
    errors.value.password = null
    return true
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select gender'
    return false
  } else {
    errors.value.gender = null
    return true
  }
}

const validateReason = (blur) => {
  const v = formData.value.reason.trim()
  if (!v || v.length < 10) {
    if (blur) errors.value.reason = 'Reason must be at least 10 characters'
    return false
  } else {
    errors.value.reason = null
    return true
  }
}

// handle form submission
const submitForm = () => {
  const valid =
    validateName(true) &
    validatePassword(true) &
    validateGender(true) &
    validateReason(true)

  if (!valid) return

  submittedCards.value.push({ ...formData.value })
  clearForm()
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
</style>
