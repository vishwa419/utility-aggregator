import { useState } from 'react';
import { toast } from 'react-toastify';

export default function PDFConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };
  
  const convertToPDF = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('http://localhost:8000/convert-pdf', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Create download link for converted PDF
        const link = document.createElement('a');
        link.href = data.pdfUrl;
        link.download = `${file.name.split('.')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('File converted to PDF successfully!');
      } else {
        toast.error(data.message || 'Error converting file to PDF');
      }
    } catch (error) {
      console.error('Error converting to PDF:', error);
      toast.error('Failed to convert file to PDF');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Select file to convert
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.html,.md,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-md file:border-0 
                    file:text-sm file:font-semibold 
                    file:bg-blue-50 file:text-blue-700 
                    hover:file:bg-blue-100"
        />
      </div>
      
      {file && (
        <div className="text-sm text-gray-600 mb-4">
          Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
        </div>
      )}
      
      <button
        onClick={convertToPDF}
        disabled={!file || loading}
        className={`w-full px-4 py-2 rounded-md text-white font-medium 
                  ${!file || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
    </div>
  );
}
