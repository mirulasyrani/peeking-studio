// src/pages/GalleryPage.tsx
import GalleryCard from '../components/GalleryCard';

const projects = [
  {
    name: 'Kissah Labels – Timeless Grace',
    folder: 'kissah-labels-timeless-grace',
    preview: '/gallery/kissah-labels-timeless-grace/preview.png',
  },
  // Add more projects here
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-pegboard text-[#102866] pt-32 pb-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Gallery</h1>
    <div className="mt-20"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <GalleryCard
            key={project.folder}
            name={project.name}
            folder={project.folder}
            preview={project.preview}
          />
        ))}
      </div>
    </div>
  );
}
