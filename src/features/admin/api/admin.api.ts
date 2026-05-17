import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const adminApi = {
  // Auth
  login: (data: any) =>
    apiClient.post("/users/login", data).then((res) => res.data),

  logout: () => apiClient.post("/users/logout", {}).then((res) => res.data),

  // Projects
  createProject: (data: FormData) =>
    apiClient
      .post("/projects", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  updateProject: (id: string, data: FormData) =>
    apiClient
      .patch(`/projects/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteProject: (id: string) =>
    apiClient.delete(`/projects/${id}`).then((res) => res.data),

  // Techs
  addTech: (data: FormData) =>
    apiClient
      .post("/techs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  updateTech: (id: string, data: FormData) =>
    apiClient
      .patch(`/techs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteTech: (id: string) =>
    apiClient.delete(`/techs/${id}`).then((res) => res.data),

  // Info
  updateInfo: (data: FormData) =>
    apiClient
      .post("/info", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  // About
  updateAbout: (data: any) =>
    apiClient.post("/about", data).then((res) => res.data),

  deleteTimeline: (data: any) =>
    apiClient.delete("/about/timeline", { data }).then((res) => res.data),

  // Footer
  updateFooter: (data: any) =>
    apiClient.post("/footer", data).then((res) => res.data),

  // Blogs
  createBlog: (data: FormData) =>
    apiClient
      .post("/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  updateBlog: (id: string, data: FormData) =>
    apiClient
      .patch(`/blogs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  deleteBlog: (id: string) =>
    apiClient.delete(`/blogs/${id}`).then((res) => res.data),

  // Contact
  getEnquiries: () => apiClient.get("/contact").then((res) => res.data),

  deleteEnquiry: (id: string) =>
    apiClient.delete(`/contact/${id}`).then((res) => res.data),
};

// Hooks
export const useAdminLogin = () => useMutation({ mutationFn: adminApi.login });
export const useAdminLogout = () =>
  useMutation({ mutationFn: adminApi.logout });

export const useGetEnquiries = () =>
  useQuery({
    queryKey: ["enquiries"],
    queryFn: adminApi.getEnquiries,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteEnquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });
};

// Generic CRUD hooks can be added here
