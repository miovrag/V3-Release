"use client";

interface Props {
  onNext: () => void;
  onClose: () => void;
}

export default function WebsiteInputModal({ onNext, onClose }: Props) {
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Build Using Your Website</h2>
        <div className="w-full h-px bg-gray-100 mb-6 mt-3" />

        <label className="block text-sm text-gray-500 mb-2">
          Enter your website&apos;s URL or sitemap to start:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            defaultValue="https://example.com"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4FE8] focus:border-transparent"
          />
          <div className="w-8 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-[#5B4FE8] border-t-transparent animate-spin" />
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-6 w-full bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white font-medium py-3 rounded-xl transition-colors"
        >
          Create Agent
        </button>
      </div>
    </div>
  );
}
