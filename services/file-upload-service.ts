
import apiClient from "./apiClient";

export const uploadFile = async (file: File, conceptId: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conceptId", conceptId);

  try {
    const response = await apiClient.post("/upload-concept-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
