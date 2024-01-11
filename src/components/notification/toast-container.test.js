import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastContainer from './ToastContainer.vue'

function mountToastContainer(toast = '') {
  return mount(ToastContainer, {
    global: {
      provide: {
        toast: {
          toasts: [toast],
        },
      },
    },
  })
}

describe('ToastContainer', () => {
  it('renders successfully', () => {
    const wrapper = mountToastContainer()
    expect(wrapper.exists()).toBe(true)
  })

  it('Success toast displayed correctly', () => {
    const wrapper = mountToastContainer({
      id: 1,
      type: 'success',
      message: 'Success message',
    })
    expect(wrapper.find('.bg-green-100').exists()).toBe(true)
    expect(wrapper.text()).toContain('Success message')
  })

  it('Error toast displayed correctly', () => {
    const wrapper = mountToastContainer({
      id: 2,
      type: 'error',
      message: 'Error message',
    })
    expect(wrapper.find('.bg-red-100').exists()).toBe(true)
    expect(wrapper.text()).toContain('Error message')
  })
})
