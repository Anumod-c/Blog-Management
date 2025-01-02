export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`

export const userEndpoints={
    register:`${BASE_URL}/auth/register`,
    verifyEmail:`${BASE_URL}/auth/verify-email`,
    login:`${BASE_URL}/auth/login`,
    changeAvatar:`${BASE_URL}/user/change-avatar`,
    updateUser: `${BASE_URL}/user/update-user`
}