<template>
  <div class="justify-center mx-10 md:mx-20 mt-10 text-left">
    <button
      type="button"
      class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
      v-on:click="$router.back()"
    >
      <span>Book list</span>
    </button>
    <div v-if="isPending" class="mt-4">Loading...</div>
    <div v-else-if="isError" class="mt-4">
      Error: failed to fetch book data, please try again
    </div>
    <div
      v-else-if="data"
      class="mt-8 flex flex-col md:flex-row rounded-lg mb-10 bg-white shadow-md"
    >
      <div class="xs:basis-full md:basis-1/3 mx-auto p-5">
        <img
          class="hover:opacity-75 w-full max-h-120 rounded-t-xl"
          v-bind:src="
            data.volumeInfo.imageLinks?.thumbnail ||
            'https://blog.springshare.com/wp-content/uploads/2010/02/nc-md.gif'
          "
        />
      </div>
      <div class="xs:basis-full md:basis-2/3 mx-auto p-5">
        <h2 class="text-center text-3xl font-semibold mt-3">
          {{ data.volumeInfo.title }}
        </h2>
        <h2 class="text-center text-2xl font-semibold mt-3">
          Authors:
          <span v-for="author in data.volumeInfo.authors" v-bind:key="author">
            <span class="text-center text-2xl font-semibold mt-3">
              {{ author }}
            </span>
          </span>
        </h2>
        <h2 class="text-center text-2xl font-semibold mt-3">
          Publisher: {{ data.volumeInfo.publisher }}
        </h2>
        <h2 class="text-center text-2xl font-semibold mt-3">
          Published Date: {{ data.volumeInfo.publishedDate }}
        </h2>
        <h2 class="text-center text-2xl font-semibold mt-3">Description</h2>
        <h3 class="text-center text-xl font-semibold mt-3">
          {{ data.volumeInfo.description }}
        </h3>
        <div class="flex justify-end mt-5">
          <button class="font-semibold p-3 rounded-lg border shadow-md">
            <a
              v-bind:href="data.volumeInfo.previewLink"
              class="text-center text-2xl"
              >Preview
            </a>
          </button>
          <button class="font-semibold p-3 rounded-lg border shadow-md ml-5">
            <a
              v-bind:href="data.saleInfo.buyLink"
              class="text-center text-2xl font-semibold mt-3"
              >Buy</a
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, inject } from 'vue'
import { useQuery } from '@tanstack/vue-query'

export default defineComponent({
  name: 'GBook',
  props: {
    bookid: String,
  },
  setup(props) {
    const toast = inject('toast')
    console.log(props)
    const { isPending, isError, isFetching, data, error, refetch } = useQuery({
      queryKey: ['bookdetail', props.bookid], // Include bookid in the queryKey
      queryFn: async () => {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${props.bookid}`,
        )
        return response.json()
      },
    })

    watch(isError, (newVal) => {
      if (newVal) {
        // Show error toast
        toast.addToast('Error fetching Book information', 'error')
      }
    })

    watch(data, (newVal) => {
      if (newVal) {
        // Show success toast
        toast.addToast('Book information fetched successfully')
      }
    })

    return { isPending, isError, isFetching, data, error, refetch }
  },
})
</script>
