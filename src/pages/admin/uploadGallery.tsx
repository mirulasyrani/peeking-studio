import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Manual type guard for older Axios versions
const isAxiosError = (error: unknown): error is { isAxiosError: boolean; response?: { data?: { message?: string } }; message?: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error
  );
};

type UploadResponse = {
  message: string;
  files: {
    filename: string;
    path: string;
    project: string;
  }[];
};

const UploadGallery = () => {
  const navigate = useNavigate();

  const [project, setProject] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Uploading...");

    if (!project.trim() || !images || images.length === 0) {
      setStatus("❌ Please enter a project name and select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("project", project.trim());
    formData.append("description", description);
    Array.from(images).forEach((image) => formData.append("images", image));

    try {
      const res = await axios.post<UploadResponse>("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus(`✅ ${res.data.message}`);
      setProject("");
      setDescription("");
      setImages(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (isAxiosError(err)) {
        setStatus(`❌ Upload failed: ${err.response?.data?.message ?? err.message}`);
      } else if ((err as unknown) instanceof Error) {
        setStatus(`❌ Upload failed: ${(err as Error).message}`);
      } else {
        setStatus("❌ Upload failed: An unknown error occurred.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-lg shadow-md text-white space-y-4">
      <button
        onClick={() => navigate('/admin')}
        className="mb-4 bg-gray-100 text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
        type="button"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-xl font-bold">📸 Upload Gallery Images</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Project name (e.g. wedding-shoot)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
        />

        <textarea
          placeholder="Project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded resize-none"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>
      {status && (
        <div className="mt-4 text-sm" data-testid="upload-status">
          {status}
        </div>
      )}
    </div>
  );
};

export default UploadGallery;
