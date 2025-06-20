import axios from 'axios';

const API_BASE_URL = "https://localhost:7281/api";

export const reportService = {downloadReport: async (): Promise<Blob> => {
  const token = localStorage.getItem('token'); 
  const response = await axios.get(`${API_BASE_URL}/Auth/download-report`, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data as Blob;
}
}


