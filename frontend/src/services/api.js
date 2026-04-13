import axios from "axios";

// This is a placeholder for the real backend API.
// In a real scenario, this would point to a FastAPI or Flask backend.
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const mockLectures = [
  { id: "1", title: "Introduction to React.mp4", status: "ready", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80", duration: "45:20" },
  { id: "2", title: "Advanced State Management.mp4", status: "ready", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", duration: "1:12:05" },
  { id: "3", title: "Building RAG AI Applications.mp4", status: "processing", thumbnail: null, duration: null },
];

export const getLectures = async () => {
  // Simulate API delay
  return new Promise((resolve) => setTimeout(() => resolve(mockLectures), 500));
};

export const uploadLecture = async (file, onProgress) => {
  // Simulate file upload
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ id: "4", title: file.name, status: "processing" });
      }
    }, 300);
  });
};

export const getTranscript = async (id) => {
  // Simulate fetching transcript
  return new Promise((resolve) => setTimeout(() => resolve([
    { start: 0.0, end: 4.66, text: "Welcome to this lecture on AI applications." },
    { start: 5.2, end: 9.4, text: "Today we will be discussing Retrieval Augmented Generation." },
    { start: 10.1, end: 15.0, text: "The main idea behind RAG is to provide external context to your LLM." },
    { start: 15.5, end: 22.3, text: "When a user asks a question, we first search our vector database for relevant information." },
    { start: 23.0, end: 28.5, text: "Then, we append that information to the user's prompt." },
    { start: 29.1, end: 35.0, text: "This reduces hallucinations and enables the LLM to access proprietary data." },
  ]), 800));
};

export const askQuestion = async (lectureId, question) => {
  // Simulate LLM delay
  return new Promise((resolve) => setTimeout(() => {
    resolve({
      answer: "RAG (Retrieval Augmented Generation) provides external context to the LLM by searching a vector database for relevant information before generating a response. This helps reduce hallucinations.",
      sources: [{ start: 10.1, end: 15.0 }, { start: 29.1, end: 35.0 }]
    });
  }, 1500));
};

export default api;
