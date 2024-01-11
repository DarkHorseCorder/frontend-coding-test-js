import { nextTick } from 'vue'

export default async function waitForUpdate(wrapper, numUpdates = 1) {
  const preState = wrapper.html()
  const postState = wrapper.html()

  for (let i = 0; i < numUpdates; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nextTick()
  }

  if (preState !== postState) {
    return true
  }

  return false
}
