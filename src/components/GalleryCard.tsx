// src/components/GalleryCard.tsx
import { useState } from "react";
import GalleryModal from "./GalleryModal";

interface GalleryCardProps {
  name: string;
  folder: string;
  preview: string;
  description?: string;
  uploadDate?: string;
  tags?: string[];
  isAdmin?: boolean;
}

export default function GalleryCard({
  name,
  folder,
  preview,
  description,
  uploadDate,
  tags = [],
  isAdmin = false,
}: GalleryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer group shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
      >
        <div className="relative w-full h-80 overflow-hidden">
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 left-0 w-full px-4 py-3 text-white text-xl text-center font-newsreader tracking-wide bg-black/40 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            {name}
          </div>
        </div>

        <div className="p-4 space-y-2 text-sm text-gray-700">
          {description && (
            <p className="line-clamp-3">
              {description.length > 100 ? description.slice(0, 100) + "..." : description}
              {description.length > 100 && (
                <span className="text-blue-600 ml-1">(read more)</span>
              )}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isAdmin && uploadDate && (
            <p className="text-xs text-zinc-500">
              Uploaded: {new Date(uploadDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <GalleryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        folder={folder}
        preview={preview}
        description={description}
        tags={tags}
      />
    </>
  );
}
