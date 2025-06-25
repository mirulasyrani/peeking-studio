// src/pages/GalleryPage.tsx
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; // Use axiosInstance, not raw axios
import GalleryCard from "../components/GalleryCard";
import { useAuth } from '../utils/useAuth';

export type Project = {
  project: string;
  thumbnail: string | null;
  description?: string;
  uploadDate?: string;
  tags?: string[];
};

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    axios
      .get<Project[]>("/gallery/projects") // now uses baseURL from axiosInstance
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error("❌ Failed to fetch gallery projects:", err);
        setProjects([]);
      });
  }, []);

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  );

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags?.includes(selectedTag))
    : projects;

  return (
    <div className="min-h-screen bg-pegboard text-[#102866] pt-32 pb-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Gallery</h1>

      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedTag === null
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-800"
            }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-800"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-600">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <GalleryCard
              key={project.project}
              name={project.project.replace(/[-_]/g, " ")}
              folder={project.project}
              preview={project.thumbnail || ""}
              description={project.description}
              tags={project.tags}
              uploadDate={project.uploadDate}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
