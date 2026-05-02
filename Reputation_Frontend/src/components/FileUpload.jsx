import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ file, setFile, onAnalyze, loading }) => {
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, [setFile]);

  return (
    <div className="max-w-3xl mx-auto">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="glass-card p-8 rounded-2xl border border-white/10 text-center backdrop-blur-lg shadow-xl"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center shadow-[0_0_30px_rgba(155,48,255,0.12)]">
            <UploadCloud className="w-10 h-10 text-white/90" />
          </div>
          <h3 className="text-xl font-bold">Bulk Data Upload</h3>
          <p className="text-sm text-gray-400">Drag & drop a CSV/JSON file or click to select</p>

          <div className="flex items-center gap-3 w-full justify-center mt-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors text-sm">Upload File</div>
            </label>
            <button
              onClick={onAnalyze}
              disabled={!file || loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent-violet text-white font-semibold shadow-[0_0_20px_rgba(155,48,255,0.35)] hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? 'Analyzing…' : 'Analyze Data'}
            </button>
          </div>

          <div className="w-full text-sm text-gray-400 mt-4">
            <div className="text-xs">Selected file:</div>
            <div className="mt-1 text-white font-medium">{file ? file.name : 'No file selected'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
