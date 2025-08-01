import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch<IVideo[]>("/video");
  }

  async createVideo(videoData: VideoFormData): Promise<IVideo> {
    return this.fetch<IVideo>("/video", {
      method: "POST",
      body: videoData,
    });
  }

  // ✅ New function for user registration
  async registerUser(
    userData: { name: string; email: string; password: string }
  ): Promise<{ message: string }> {
    return this.fetch<{ message: string }>("/auth/register", {
      method: "POST",
      body: userData,
    });
  }

  // For login 
  /*🔹 IMPORT signIn helper
  import { signIn } from 'next-auth/react';
  */
}

export const apiClient = new ApiClient();