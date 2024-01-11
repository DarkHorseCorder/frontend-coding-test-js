import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/vue-query'
import GBook from './GBook.vue'
import waitForUpdate from '../utils/waitForUpdate'

const mockBooks = {
  items: [
    {
      id: '1',
      volumeInfo: {
        title: 'Book 1',
        publishedDate: '2022-01-01',
        imageLinks: { smallThumbnail: 'image1.jpg' },
      },
    },
    {
      id: '2',
      volumeInfo: {
        title: 'Book 2',
        publishedDate: '2022-02-01',
        imageLinks: { smallThumbnail: 'image2.jpg' },
      },
    },
  ],
}

const toast = {
  addToast: vi.fn(),
}

const queryClient = new QueryClient()

vi.mock('@tanstack/vue-query', () => ({
  ...vi.requireActual('@tanstack/vue-query'),
  useQueryClient: vi.fn(() => queryClient),
  useQuery: vi.fn(({ queryKey, queryFn }) => {
    const queryClient = useQueryClient()
    const queryKeyString = JSON.stringify(queryKey)
    const fetchData = async () => {
      try {
        const data = await queryFn()
        queryClient.setQueryData(queryKeyString, data)
        return data
      } catch (error) {
        queryClient.setQueryData(queryKeyString, undefined, { error })
        throw error
      }
    }
    const query = queryClient.getQueryData(queryKeyString) || queryClient.createQuery(queryKeyString, fetchData)
    return {
      ...query,
      refetch: vi.fn(fetchData),
    }
  }),
}))

function mountGBook() {
  return mount(GBook, {
    global: {
      provide: {
        toast,
      },
    },
    plugins: [QueryClientProvider],
  })
}

describe('GBook', () => {
  it('renders loading state initially', () => {
    const wrapper = mountGBook()

    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders books after loading', async () => {
    const wrapper = mountGBook()

    await waitForUpdate(wrapper, 3)

    expect(wrapper.findAll('img')).toHaveLength(mockBooks.items.length)
  })

  it('displays an error message if the API call fails', async () => {
    const fetcherError = new Error('Network Error')

    vi.mockImplementationOnce(() => ({
      ...vi.requireActual('@tanstack/vue-query'),
      useQuery: vi.fn(() => ({
        isFetching: false,
        isError: true,
        error: fetcherError,
        data: undefined,
        refetch: vi.fn(),
      })),
    }))

    const wrapper = mountGBook()

    await waitForUpdate(wrapper, 3)

    expect(wrapper.text()).toContain('Error: Failed to fetch Google Book data, please try again')
    expect(toast.addToast).toHaveBeenCalledWith('Error fetching Google Book data', 'error')
  })
})
