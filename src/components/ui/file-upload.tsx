"use client";

import { useCallback, useState } from 'react';

/**
 * A minimalist drag‑and‑drop file upload area.  Files selected by the
 * user are stored in the component's internal state so that parent
 * components can be easily extended later to perform uploads.
 */
export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback<React.DragEventHandler<HTMLDivElement>>((event) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files);
    setFiles([...files, ...dropped]);
  }, [files]);

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    if (!event.target.files) return;
    const selected = Array.from(event.target.files);
    setFiles([...files, ...selected]);
  }, [files]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[var(--ocean-mist)] rounded-2xl cursor-pointer text-center hover:border-[var(--sunset-gold)] transition-colors"
    >
      <input type="file" multiple onChange={handleChange} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="flex flex-col items-center space-y-3">
        {/* Upload icon */}
        <svg className="h-10 w-10 text-[var(--sunset-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 9l-4.5-4.5m0 0L7.5 9m4.5-4.5v12" />
        </svg>
        <span className="text-sm">Drag & drop files here or click to browse</span>
      </label>
      {files.length > 0 && (
        <ul className="mt-4 w-full text-left text-xs space-y-1">
          {files.map((file, idx) => (
            <li key={idx} className="truncate">
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}