import { apiClient } from "@/api/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Blog, Info, Profile, Project, Tech } from "@/types";

export const portfolioApi = {
  getInfo: () => apiClient.get<Info>("/info").then((res) => res.data),
  getAbout: () => apiClient.get<Profile>("/about").then((res) => res.data),
  getProjects: () => apiClient.get<Project[]>("/projects").then((res) => res.data),
  getTechs: () => apiClient.get<Tech[]>("/techs").then((res) => res.data),
  getBlogs: () => apiClient.get<Blog[]>("/blogs").then((res) => res.data),
  getBlog: (id: string) => apiClient.get<{ data: any }>(`/blogs/${id}`).then((res) => res.data),
  submitContact: (data: any) => apiClient.post("/contact", data).then((res) => res.data),
};

export const useGetInfo = () =>
  useQuery({
    queryKey: ["info"],
    queryFn: portfolioApi.getInfo,
  });

export const useGetAbout = () =>
  useQuery({
    queryKey: ["about"],
    queryFn: portfolioApi.getAbout,
  });

export const useListProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: portfolioApi.getProjects,
  });

export const useListTechs = () =>
  useQuery({
    queryKey: ["techs"],
    queryFn: portfolioApi.getTechs,
  });

export const useListBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: portfolioApi.getBlogs,
  });

export const useGetBlog = (id: string) =>
  useQuery({
    queryKey: ["blog", id],
    queryFn: () => portfolioApi.getBlog(id),
    enabled: !!id,
  });

export const useSubmitContact = () =>
  useMutation({
    mutationFn: portfolioApi.submitContact,
  });
