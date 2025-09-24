<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Add Book -->
        <div class="card shadow-sm mb-4">
          <div class="card-header d-flex align-items-center">
            <h5 class="mb-0">Add Book</h5>
          </div>

          <div class="card-body">
            <div v-if="message" class="mb-3">
              <div :class="['alert', ok ? 'alert-success' : 'alert-danger']" role="alert">
                {{ message }}
              </div>
            </div>

            <form @submit.prevent="addBook" novalidate>
              <!-- ISBN -->
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input
                  id="isbn"
                  type="number"
                  class="form-control"
                  v-model.number="isbn"
                  :class="{ 'is-invalid': isbnInvalid }"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 9781234567897"
                />
                <div class="form-text">Must be a number (saved as Firestore number).</div>
                <div class="invalid-feedback">Please enter a valid positive number.</div>
              </div>

              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  class="form-control"
                  v-model.trim="name"
                  :class="{ 'is-invalid': nameInvalid }"
                  required
                  placeholder="Book title"
                />
                <div class="invalid-feedback">Name is required.</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ submitting ? 'Saving...' : 'Add Book' }}
              </button>
            </form>
          </div>

          <div class="card-footer text-muted small">
            Saved to Firestore collection: <code>books</code>
          </div>
        </div>

        <!-- Books List -->
        <div class="card shadow-sm">
          <div class="card-header">
            <h6 class="mb-0">Books Filter </h6>
          </div>
          <div class="card-body">
            <BooksList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { db } from '@/lib/firebaseClient'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import BooksList from '@/components/BookList.vue'

export default {
  name: 'AddBookView',
  components: { BooksList }, 
  setup() {
    const isbn = ref(null)
    const name = ref('')
    const submitting = ref(false)
    const ok = ref(false)
    const message = ref('')

    const isbnInvalid = computed(() => {
      if (isbn.value === null) return false
      const n = Number(isbn.value)
      return Number.isNaN(n) || n <= 0
    })
    const nameInvalid = computed(() => (name.value !== '' ? name.value.trim().length === 0 : false))

    const addBook = async () => {
      ok.value = false
      message.value = ''

      const n = Number(isbn.value)
      if (!n || Number.isNaN(n) || n <= 0) {
        message.value = 'Please enter a valid numeric ISBN.'
        return
      }
      if (!name.value || name.value.trim().length === 0) {
        message.value = 'Please enter the book name.'
        return
      }

      submitting.value = true
      try {
        const payload = {
          isbn: n,
          name: name.value.trim(),
          createdAt: serverTimestamp(),
        }
        await addDoc(collection(db, 'books'), payload)

        ok.value = true
        message.value = `Book added: ISBN ${payload.isbn}, Name "${payload.name}"`
        isbn.value = null
        name.value = ''
      } catch (e) {
        console.error('[AddBook] addDoc failed:', e)
        ok.value = false
        message.value = e?.message || 'Failed to add book'
      } finally {
        submitting.value = false
      }
    }

    return { isbn, name, addBook, submitting, ok, message, isbnInvalid, nameInvalid }
  },
}
</script>

<style scoped>
.card { border-radius: 12px; }
.card-header { background: #f8f9fa; }
</style>