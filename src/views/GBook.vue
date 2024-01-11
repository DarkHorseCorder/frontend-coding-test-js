<template>
  <div class="justify-center mt-10">
    <h1 class="font-extrabold tracking-tigh text-3xl leading-10">
      Google Books
    </h1>
    <div v-if="isPending" class="mt-4">Loading...</div>
    <div v-else-if="isError" class="mt-4">
      An error has occurred: {{ error }}
    </div>
    <div v-else-if="data">
      <div class="container mx-auto mt-10">
        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8"
        >
          <div
            v-for="book in data.items"
            v-bind:key="book.id"
            class="bg-gray-100 border-2 border-gray-300 rounded-xl"
          >
            <router-link
              v-bind:to="{
                name: 'BookInfo',
                params: { bookid: book.id },
              }"
            >
              <img
                class="hover:opacity-75 w-full max-h-80 rounded-t-xl"
                v-bind:src="
                  book.volumeInfo.imageLinks?.smallThumbnail ||
                  'https://blog.springshare.com/wp-content/uploads/2010/02/nc-md.gif'
                "
              />
              <p class="font-bold p-2 text-md">{{ book.volumeInfo.title }}</p>
              <p>{{ book.volumeInfo.publishedDate }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, inject } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const fetcher = async () => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=harrypotter&maxResults=24&langRestrict=en`,
  )
  return response.json()
}

export default defineComponent({
  name: 'GBook',
  setup() {
    const toast = inject('toast')
    const { isPending, isError, isFetching, data, error, refetch } = useQuery({
      queryKey: ['gbooks'],
      queryFn: fetcher,
    })

    watch(isError, (newVal) => {
      if (newVal) {
        // Show error toast
        toast.addToast('Error fetching Google Book data', 'error')
      }
    })
    watch(data, (newVal) => {
      if (newVal)
        // Show success toast
        toast.addToast('Google Book data fetched successfully')
    })
    return { isPending, isError, isFetching, data, error, refetch }
  },
})
</script>
