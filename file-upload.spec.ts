import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Let's assume you have a component like this.
// It's a simple component with a file input and an image tag for previews.
const FileUploadComponent = ({ onUpload }) => {
  const [preview, setPreview] = React.useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Upload File</label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        aria-label="File uploader"
      />
      {preview && <img src={preview} alt="File preview" />}
    </div>
  );
};

describe('File Upload Component', () => {
  beforeEach(() => {
    // Mock the URL.createObjectURL API before each test
    window.URL.createObjectURL = vi.fn(() => 'mock-object-url');
    // Clean up the mock after each test
    return () => {
      vi.restoreAllMocks();
    };
  });

  it('should allow a user to select a file and display a preview', async () => {
    const user = userEvent.setup();
    const mockFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const handleUpload = vi.fn();

    render(<FileUploadComponent onUpload={handleUpload} />);

    const fileInput = screen.getByLabelText(/file uploader/i);
    await user.upload(fileInput, mockFile);

    expect(handleUpload).toHaveBeenCalledWith(mockFile);
    const previewImage = await screen.findByAltText('File preview');
    expect(previewImage).toHaveAttribute('src', 'mock-object-url');
  });
});