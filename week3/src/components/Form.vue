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
                  @blur="validateField('username')"
                  @input="errors.username && validateField('username')"
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
                  @blur="validateField('password')"
                  @input="errors.password && validateField('password')"
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
                    @blur="validateField('isAustralian')"
                    @input="errors.isAustralian && validateField('isAustralian')"
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
                  @blur="validateField('gender')"
                  @change="errors.gender && validateField('gender')"
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
                @blur="validateField('reason')"
                @input="errors.reason && validateField('reason')"
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
  import { z } from 'zod'

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

  // Map Zod issues to our errors object
  const setAllErrors = (issues) => {
    // reset first
    errors.value = {
      username: null,
      password: null,
      isAustralian: null,
      reason: null,
      gender: null
    }
    for (const i of issues) {
      const field = i.path?.[0]
      if (field && field in errors.value) {
        errors.value[field] = i.message
      }
    }
  }

  // Validate a single field using schema.pick({...})
  const validateField = (field) => {
    // small schema only for one field
    const single = schema.pick({ [field]: true })
    const obj = { [field]: formData.value[field] }
    const res = single.safeParse(obj)
    errors.value[field] = res.success ? null : res.error.issues[0].message
  }

  // handle form submission
  const submitForm = () => {
    // delete the spaces
    trimAll()

    // validate the whole form by using the full schema
    const result = schema.safeParse(formData.value)
    if (!result.success) {
      setAllErrors(result.error.issues)
      return
    }

    // username uniqueness check
    const uname = formData.value.username.trim().toLowerCase()
    const exists = submittedCards.value.some(u => u.username.trim().toLowerCase() === uname)
    if (exists) {
      errors.value.username = 'This username has already been used.'
      return
    }

    // pass validation, clear errors
    submittedCards.value.push({ ...result.data })
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

  // Banned words for reason validation
  const bannedWords = ['spam', 'fake', 'hack'];

  // delete the spaces
  const trimAll = () => {
    formData.value.username = formData.value.username.trim();
    formData.value.password = formData.value.password.trim();
    formData.value.reason   = formData.value.reason.trim();
  };

  // Zod schema for the whole form
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
