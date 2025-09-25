<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header d-flex align-items-center">
            <h5 class="mb-0">GetAllBookAPI</h5>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

            <button class="btn btn-primary mb-3" @click="loadBooks" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>

            <pre class="bg-light p-3 rounded small mb-0">{{ pretty }}</pre>
          </div>
          <div class="card-footer text-muted small">
            Source: <code>{{ FUNCTION_URL }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const FUNCTION_URL =
  "https://us-central1-week7-xuqing.cloudfunctions.net/getAllBooks";

export default {
  name: "GetAllBookAPI",
  data() {
    return {
      loading: false,
      error: "",
      books: [],
      FUNCTION_URL,
    };
  },
  computed: {
    pretty() {
      return this.books.length ? JSON.stringify(this.books, null, 2) : "[]";
    },
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.loading = true;
      this.error = "";
      try {
        const res = await fetch(FUNCTION_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        this.books = await res.json();
      } catch (e) {
        console.error(e);
        this.error = e.message || "Failed to fetch books";
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card { border-radius: 12px; }
.card-header { background: #f8f9fa; }
pre { max-height: 60vh; overflow: auto; }
</style>