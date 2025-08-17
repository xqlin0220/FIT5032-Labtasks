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
                id="username"
                type="text"
                class="form-control"
                v-model="username"
                v-bind="usernameAttrs"
              />
              <div v-if="usernameError" class="text-danger">
                {{ usernameError }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                v-model="password"
                v-bind="passwordAttrs"
              />
              <div v-if="passwordError" class="text-danger">
                {{ passwordError }}
              </div>
            </div>
          </div>

          <!-- Row: Checkbox and Dropdown -->
          <div class="row mb-3">
            <!-- Australian Resident -->
            <div class="col-md-6">
              <div class="form-check">
                <input
                  id="isAustralian"
                  type="checkbox"
                  class="form-check-input"
                  v-model="isAustralian"
                  v-bind="isAustralianAttrs"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>
            </div>

            <!-- Gender -->
            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select
                id="gender"
                class="form-select"
                v-model="gender"
                v-bind="genderAttrs"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="genderError" class="text-danger">
                {{ genderError }}
              </div>
            </div>
          </div>

          <!-- Textarea: Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              id="reason"
              class="form-control"
              rows="3"
              v-model="reason"
              v-bind="reasonAttrs"
            ></textarea>
            <div v-if="reasonError" class="text-danger">
              {{ reasonError }}
            </div>
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

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
import { z } from 'zod'

const submittedCards = ref([])

/* banned words for reason validation */
const bannedWords = ['spam', 'fake', 'hack']

/* zod schema */
const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(16, 'Username must be at most 16 characters')
    .regex(/^[A-Za-z0-9_]+$/, 'Use letters, numbers or underscore only'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select gender' })
  }),
  reason: z
    .string()
    .trim()
    .min(10, 'Reason must be 10 - 200 characters')
    .max(200, 'Reason must be 10 - 200 characters')
    .refine(v => !/(https?:\/\/|www\.)/i.test(v), 'Reason must not contain URLs')
    .refine(v => !bannedWords.some(w => v.toLowerCase().includes(w)), 'Reason contains inappropriate words'),
  isAustralian: z.boolean().optional()
})

/* generic validator factory */
function createValidator (initialValue, validate, onlyValidatesOnBlur = false) {
  const value = ref(initialValue)
  const error = ref(undefined)

  const run = (byBlur = false) => {
    const res = validate(value.value)
    if (res === true) {
      error.value = undefined
    } else if (byBlur || !onlyValidatesOnBlur) {
      error.value = res
    }
  }

  const attrs = {
    onInput: () => {
      if (!onlyValidatesOnBlur) run(false)
    },
    onChange: () => {
      if (!onlyValidatesOnBlur) run(false)
    },
    onBlur: () => run(true)
  }

  return [value, error, attrs]
}

/* field validators */
const [username, usernameError, usernameAttrs] = createValidator(
  '',
  v => {
    const r = schema.pick({ username: true }).safeParse({ username: v?.trim?.() ?? '' })
    return r.success ? true : r.error.issues[0].message
  }
)

const [password, passwordError, passwordAttrs] = createValidator(
  '',
  v => {
    const r = schema.pick({ password: true }).safeParse({ password: v ?? '' })
    return r.success ? true : r.error.issues[0].message
  },
  true // validate on blur only
)

const [gender, genderError, genderAttrs] = createValidator(
  '',
  v => {
    const r = schema.pick({ gender: true }).safeParse({ gender: v ?? '' })
    return r.success ? true : r.error.issues[0].message
  }
)

const [reason, reasonError, reasonAttrs] = createValidator(
  '',
  v => {
    const r = schema.pick({ reason: true }).safeParse({ reason: (v ?? '').trim() })
    return r.success ? true : r.error.issues[0].message
  }
)

/* checkbox: no validation, just mirror value and events */
const [isAustralian, , isAustralianAttrs] = createValidator(false, () => true)

/* submit */
const submitForm = () => {
  const payload = {
    username: (username.value || '').trim(),
    password: password.value || '',
    gender: gender.value || '',
    reason: (reason.value || '').trim(),
    isAustralian: !!isAustralian.value
  }

  const result = schema.safeParse(payload)
  if (!result.success) {
    const map = Object.fromEntries(result.error.issues.map(i => [i.path?.[0], i.message]))
    usernameError.value = map.username
    passwordError.value = map.password
    genderError.value = map.gender
    reasonError.value = map.reason
    return
  }

  const uname = payload.username.toLowerCase()
  const exists = submittedCards.value.some(
    u => (u.username || '').trim().toLowerCase() === uname
  )
  if (exists) {
    usernameError.value = 'This username has already been used.'
    return
  }

  submittedCards.value.push({ ...result.data })
  clearForm()
}

/* reset */
const clearForm = () => {
  username.value = ''
  password.value = ''
  gender.value = ''
  reason.value = ''
  isAustralian.value = false

  usernameError.value = undefined
  passwordError.value = undefined
  genderError.value = undefined
  reasonError.value = undefined
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
