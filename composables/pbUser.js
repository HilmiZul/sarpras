import { useState } from 'nuxt/app';
import { usePbClient } from './pbClient'

export const usePbUser = () => {
  let client = usePbClient()
  let user = useState('user')
  let isUserLoggedIn = client?.authStore.isValid;

  if(isUserLoggedIn) {
    const avatarUrl = client.files.getURL(client.authStore.model, client.authStore.model.avatar)
    user.value = {
      id: client?.authStore?.model?.id,
      username: client?.authStore?.model?.username,
      email: client?.authStore?.model?.email,
      nama: client?.authStore?.model?.nama,
      role: client?.authStore?.model?.role,
      unit_kerja: client?.authStore?.model?.unit_kerja,
      avatar: avatarUrl,
    }
  } else {
    user.value = null
  }
  return { user, isUserLoggedIn }
}
