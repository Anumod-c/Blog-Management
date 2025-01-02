export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/blog`

export const blogEndpoints={
    addBlog:`${BASE_URL}/add-blog`,
    fetchBlogs:`${BASE_URL}/fetch-blog`,
    singleblog: `${BASE_URL}/single-blog`,    
    fetchUserBLogs: `${BASE_URL}/user-blogs`,    
    updateBlog: `${BASE_URL}/update-blog`,    
    deleteBlog: `${BASE_URL}/delete-blog`,    
}