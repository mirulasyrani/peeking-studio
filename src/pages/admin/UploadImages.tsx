import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadImages() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImages(fileArray);

      // Revoke old URLs to avoid memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));

      setPreviewUrls(fileArray.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0 || !title.trim() || !folder.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('folder', folder.trim());
      formData.append('caption', caption.trim());

      images.forEach((imageFile) => {
        formData.append('images', imageFile);
      });

      const response = await fetch('/api/upload/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(`Upload successful! Uploaded ${data.files.length} file(s).`);

      // Reset form on success
      setTitle('');
      setFolder('');
      setCaption('');
      setImages([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17388E] text-white py-32 px-6">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 bg-gray-100 text-[#17388E] font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
        type="button"
      >
        ← Back to Dashboard
      </button>

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
            onChange={e => setTitle(e.target.value)}
            required
            disabled={uploading}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Folder Name *</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={folder}
            onChange={e => setFolder(e.target.value)}
            required
            disabled={uploading}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Caption (Optional)</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Images *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
            required
            disabled={uploading}
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-medium">Preview:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full max-h-40 object-cover border border-teal-600 rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg w-full ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>

        {message && (
          <p className="mt-4 text-center font-medium text-teal-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
