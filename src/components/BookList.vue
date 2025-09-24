<template>
  <div>
    <!-- Controls -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <!-- Min ISBN -->
          <div class="col-6 col-md-2">
            <label class="form-label mb-1">Min ISBN</label>
            <input
              type="number"
              class="form-control form-control-sm"
              v-model.number="minIsbn"
              min="0"
              step="1"
              @change="reload"
              placeholder="e.g. 1"
            />
          </div>

          <!-- Max ISBN -->
          <div class="col-6 col-md-2">
            <label class="form-label mb-1">Max ISBN</label>
            <input
              type="number"
              class="form-control form-control-sm"
              v-model.number="maxIsbn"
              min="0"
              step="1"
              @change="reload"
              placeholder="e.g. 9999"
            />
          </div>

          <!-- Order -->
          <div class="col-12 col-md-4">
            <label class="form-label mb-1">Order by ISBN</label>
            <select class="form-select" v-model="orderDir" @change="reload">
              <option value="asc">small → large</option>
              <option value="desc">large → small</option>
            </select>
          </div>

          <!-- Limit -->
          <div class="col-6 col-md-2">
            <label class="form-label mb-1">Limit</label>
            <input
              type="number"
              class="form-control"
              v-model.number="limitCount"
              min="1"
              step="1"
              @change="reload"
            />
          </div>

          <div class="col-6 col-md-2 d-grid">
            <button class="btn btn-outline-secondary" @click="reload" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Books list -->
    <ul class="list-group">
      <li v-for="b in books" :key="b.id" class="list-group-item">
        <!-- view mode -->
        <div v-if="editingId !== b.id" class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-semibold">{{ b.name }}</div>
            <small class="text-muted">ISBN: {{ b.isbn }}</small>
          </div>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" @click="beginEdit(b)">Edit</button>
            <button
              class="btn btn-outline-danger btn-sm"
              :disabled="working && deletingId === b.id"
              @click="removeBook(b.id)"
            >
              <span v-if="working && deletingId === b.id" class="spinner-border spinner-border-sm me-1"></span>
              Delete
            </button>
          </div>
        </div>

        <!-- edit mode -->
        <div v-else class="row g-2 align-items-end">
          <div class="col-7">
            <label class="form-label mb-1">Name</label>
            <input type="text" class="form-control" v-model.trim="editName" />
          </div>
          <div class="col-5">
            <label class="form-label mb-1">ISBN</label>
            <input type="number" class="form-control" v-model.number="editIsbn" min="1" step="1" />
          </div>
          <div class="col-12 d-flex gap-2 mt-2">
            <button
              class="btn btn-primary btn-sm"
              :disabled="working && savingId === b.id"
              @click="saveEdit"
            >
              <span v-if="working && savingId === b.id" class="spinner-border spinner-border-sm me-1"></span>
              Save
            </button>
            <button class="btn btn-outline-secondary btn-sm" :disabled="working" @click="cancelEdit">
              Cancel
            </button>
          </div>
          <div v-if="rowError" class="text-danger small mt-2">{{ rowError }}</div>
        </div>
      </li>
    </ul>

    <p v-if="loading" class="text-muted mt-3">Loading...</p>
    <p v-else-if="books.length === 0" class="text-muted mt-3">No books found.</p>
    <p v-if="!loading && error" class="text-danger mt-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/lib/firebaseClient'
import {
  collection,
  query,
  where,
  orderBy,
  limit as qlimit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'

type Book = { id: string; name: string; isbn: number; createdAt?: Timestamp | null }

const books = ref<Book[]>([])
const loading = ref(false)
const error = ref('')

const minIsbn = ref<number | null>(null)
const maxIsbn = ref<number | null>(null)
const orderDir = ref<'asc' | 'desc'>('asc')
const limitCount = ref<number>(50)

const editingId = ref<string | null>(null)
const editName = ref<string>('')
const editIsbn = ref<number | null>(null)
const working = ref(false)
const savingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const rowError = ref('')

function buildQuery() {
  const constraints: any[] = []

  if (minIsbn.value != null) constraints.push(where('isbn', '>=', minIsbn.value))
  if (maxIsbn.value != null) constraints.push(where('isbn', '<=', maxIsbn.value))

  // Firestore requires orderBy on the same field as inequality for some queries.
  constraints.push(orderBy('isbn', orderDir.value))

  if (limitCount.value && limitCount.value > 0) constraints.push(qlimit(limitCount.value))

  return query(collection(db, 'books'), ...constraints)
}

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const q = buildQuery()
    const snap = await getDocs(q)
    books.value = snap.docs.map((d) => {
      const data: any = d.data()
      return { id: d.id, name: data.name, isbn: data.isbn, createdAt: data.createdAt ?? null }
    })
  } catch (e: any) {
    console.error('[BooksList] load error:', e)
    error.value = e?.message || 'Failed to load books'
  } finally {
    loading.value = false
  }
}

function beginEdit(b: Book) {
  editingId.value = b.id
  editName.value = b.name
  editIsbn.value = b.isbn
  rowError.value = ''
}

function cancelEdit() {
  editingId.value = null
  editName.value = ''
  editIsbn.value = null
  rowError.value = ''
}

async function saveEdit() {
  if (!editingId.value) return
  const n = Number(editIsbn.value)
  if (!editName.value.trim()) {
    rowError.value = 'Name is required'
    return
  }
  if (!n || Number.isNaN(n) || n <= 0) {
    rowError.value = 'ISBN must be a positive number'
    return
  }

  working.value = true
  savingId.value = editingId.value
  try {
    await updateDoc(doc(db, 'books', editingId.value), {
      name: editName.value.trim(),
      isbn: n,
    })
    await reload()
    cancelEdit()
  } catch (e: any) {
    rowError.value = e?.message || 'Update failed'
  } finally {
    working.value = false
    savingId.value = null
  }
}

async function removeBook(id: string) {
  if (!confirm('Delete this book?')) return
  working.value = true
  deletingId.value = id
  try {
    await deleteDoc(doc(db, 'books', id))
    await reload()
  } catch (e: any) {
    rowError.value = e?.message || 'Delete failed'
  } finally {
    working.value = false
    deletingId.value = null
  }
}

function formatTime(ts?: Timestamp | null) {
  if (!ts) return ''
  const date = ts.toDate()
  return new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

onMounted(reload)
</script>

<style scoped>
.list-group-item { font-size: 15px; }
</style>