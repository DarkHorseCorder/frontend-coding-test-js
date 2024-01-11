import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useQuery } from '@tanstack/vue-query'
import BookInfo from './BookInfo.vue'
import waitForUpdate from '../utils/waitForUpdate'

const mockBookInfo = {
  volumnInfo: {
    title: 'Harry Potter i Zakon Feniksa',
    authors: ['J.K. Rowling'],
    publisher: 'Pottermore Publishing',
    publishedDate: '2023-10-31',
    description:
      '<p>Harry znów spędza nudne, przykre wakacje w domu Dursleyów. Czeka go piąty rok nauki w Hogwarcie i chciałby jak najszybciej spotkać się ze swoimi najlepszymi przyjaciółmi, Ronem i Hermioną. Ci jednak wyraźnie go zaniedbują. Gdy Harry ma już dość wszystkiego wszystkiego postanawia jakoś zmienić swoją nieznośną sytuację, sprawy przyjmują całkiem nieoczekiwany obrót.</p>',
    imageLinks: {
      smallThumbnail:
        'http://books.google.com/books/publisher/content?id=mk7gEAAAQBAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE723jV8sE1lLmUCSSZlynRbn84oGQCDrazGtmGrYfqldUGF-d4-Ow4jAJPtNlGGGqANp5Yb01TDe-1OwWN5z9O_UUJqG7Bmw7nRLST7r-oa2wHpN8VfaEatLWOujKbE5plQBxhmV&source=gbs_api',
      thumbnail:
        'http://books.google.com/books/publisher/content?id=mk7gEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73ROwwcW5WGGjEyD9Raj9je4tOJjiebIi2mj2yHNavLC6GXhuPC51PnfZUq-r8nYbMULVRKafsu1nwKON-H6n9GJKJnbL3ww8S3WBvvusJUUj5lRGUpmb_59WBe0BfsWOeg66tH&source=gbs_api',
    },
    previewLink:
      'http://books.google.pl/books?id=mk7gEAAAQBAJ&hl=&source=gbs_api',
  },
  saleInfo: {
    buyLink:
      'https://play.google.com/store/books/details?id=mk7gEAAAQBAJ&rdid=book-mk7gEAAAQBAJ&rdot=1&source=gbs_api',
  }
}

const toast = {
  addToast: vi.fn(),
}

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(() => ({
    isPending: true,
    isError: false,
    isFetching: false,
    data: null,
    error: null,
    refetch: vi.fn(),
  })),
}))

function mountBookInfo() {
  return mount(BookInfo, {
    props: {
      bookid: 'mk7gEAAAQBAJ', // Provide a book ID for the test
    },
    global: {
      provide: {
        toast,
      },
    },
  })
}

describe('BookInfo', () => {
  it('renders loading state initially', () => {
    const wrapper = mountBookInfo()

    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders book details after loading', async () => {
    useQuery.mockImplementation(() => ({
      isPending: false,
      isError: false,
      isFetching: false,
      data: mockBookInfo,
      error: null,
      refetch: vi.fn(),
    }))

    const wrapper = mountBookInfo()
    await waitForUpdate(wrapper, 3)

    expect(wrapper.text()).toContain('Harry Potter i Zakon Feniksa')
    expect(wrapper.text()).toContain('J.K. Rowling')
    expect(wrapper.text()).toContain('Pottermore Publishing')
    expect(wrapper.text()).toContain('2023-10-31')
    expect(wrapper.text()).toContain(
      '<p>Harry znów spędza nudne, przykre wakacje w domu Dursleyów. Czeka go piąty rok nauki w Hogwarcie i chciałby jak najszybciej spotkać się ze swoimi najlepszymi przyjaciółmi, Ronem i Hermioną. Ci jednak wyraźnie go zaniedbują. Gdy Harry ma już dość wszystkiego wszystkiego postanawia jakoś zmienić swoją nieznośną sytuację, sprawy przyjmują całkiem nieoczekiwany obrót.</p>',
    )
  })

  it('displays an error message if the API call fails', async () => {
    useQuery.mockImplementation(() => ({
      isPending: false,
      isError: true,
      isFetching: false,
      data: null,
      error: new Error('Network Error'),
      refetch: vi.fn(),
    }))

    const wrapper = mountBookInfo()

    await waitForUpdate(wrapper, 3)

    expect(wrapper.text()).toContain(
      'Error: failed to fetch book data, please try again',
    )
    expect(toast.addToast).toHaveBeenCalledWith(
      'Error fetching Book information',
      'error',
    )
  })
})
