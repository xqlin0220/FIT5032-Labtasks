<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form</h1>

        <!-- use VeeValidate Form -->
        <VForm
          :validation-schema="schemaVee"
          @submit="onSubmit"
        >
          <!-- Row: Username and Password -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <Field
                name="username"
                type="text"
                class="form-control"
                id="username"
              />
              <ErrorMessage name="username" class="text-danger" />
            </div>

            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <Field
                name="password"
                type="password"
                class="form-control"
                id="password"
              />
              <ErrorMessage name="password" class="text-danger" />
            </div>
          </div>

          <!-- Row: Checkbox and Dropdown -->
          <div class="row mb-3">
            <!-- Australian Resident -->
            <div class="col-md-6">
              <div class="form-check">
                <Field
                  name="isAustralian"
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>
            </div>

            <!-- Gender -->
            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <Field as="select" name="gender" class="form-select" id="gender">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" class="text-danger" />
            </div>
          </div>

          <!-- Textarea: Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <Field
              as="textarea"
              name="reason"
              class="form-control"
              id="reason"
              rows="3"
            />
            <ErrorMessage name="reason" class="text-danger" />
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="reset" class="btn btn-secondary">Clear</button>
          </div>
        </VForm>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Banned words for reason validation
const bannedWords = ['spam', 'fake', 'hack']

// Zod schema
const schema = z.object({
  username: z.string().trim()
    .min(3, 'Username must be at least 3 characters')
    .max(16, 'Username must be at most 16 characters')
    .regex(/^[A-Za-z0-9_]+$/, 'Use letters, numbers or underscore only'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select gender' })
  }),
  reason: z.string().trim()
    .min(10, 'Reason must be 10 - 200 characters')
    .max(200, 'Reason must be 10 - 200 characters')
    .refine(v => !/(https?:\/\/|www\.)/i.test(v), 'Reason must not contain URLs')
    .refine(v => !bannedWords.some(w => v.toLowerCase().includes(w)), 'Reason contains inappropriate words'),
  isAustralian: z.boolean().optional()
})

// Convert Zod schema to VeeValidate schema
const schemaVee = toTypedSchema(schema)

// Reactive state to store submitted cards
const submittedCards = ref([])

const onSubmit = (values, { resetForm }) => {
  submittedCards.value.push({ ...values })
  resetForm()
}
</script>
