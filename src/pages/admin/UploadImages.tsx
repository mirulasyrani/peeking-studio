import { useState } from 'react';

export default function UploadImages() {
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title || !folder) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log({ title, folder, caption, image });
    alert('Simulated upload successful. Check console.');
  };

  return (
    <div className="min-h-screen bg-[#17388E] text-white py-32 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Project Images</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white text-black p-6 rounded-xl shadow-lg space-y-6"
      >
        <div>
          <label className="block font-medium mb-1">Project Title *</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Folder Name *</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Caption (Optional)</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="mb-2 font-medium">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-80 object-contain border rounded-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg w-full"
        >
          Simulate Upload
        </button>
      </form>
    </div>
  );
}
