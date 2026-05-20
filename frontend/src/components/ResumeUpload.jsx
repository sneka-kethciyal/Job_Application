import { useState } from 'react';

const ResumeUpload = ({ value, onChange, required = false }) => {
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setError('');
      setFileName('');
      onChange(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed. Please upload a PDF resume.');
      setFileName('');
      onChange(null);
      e.target.value = '';
      return;
    }

    setError('');
    setFileName(file.name);
    onChange(file);
  };

  const handleRemove = () => {
    setFileName('');
    setError('');
    onChange(null);
    const input = document.querySelector('.resume-input');
    if (input) input.value = '';
  };

  return (
    <div className="resume-upload-container">
      <label className="resume-label">
        Upload Resume
        {required && <span className="required-asterisk">*</span>}
      </label>

      <label htmlFor="resume-input" className="resume-upload-box">
        <div className="upload-icon">📄</div>
        <p className="upload-text">
          {fileName ? `Selected: ${fileName}` : 'Click to select or drag PDF here'}
        </p>
        <p className="upload-hint">PDF files only</p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="resume-input"
          id="resume-input"
        />
      </label>

      {fileName && (
        <div className="file-selected">
          <div className="file-info">
            <span className="file-icon">✓</span>
            <span className="file-name">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
