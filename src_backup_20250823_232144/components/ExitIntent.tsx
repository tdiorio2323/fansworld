"use client";
import { useExitIntent } from "@/hooks/useExitIntent";

export default function ExitIntent() {
  const { show, setShow } = useExitIntent(800);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
      <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-xl max-w-md w-full">
        <h3 className="text-xl font-semibold">Before you go</h3>
        <p className="mt-2">Claim a VIP invite. Limited codes remain.</p>
        <div className="mt-4 flex gap-2">
          <a 
            href="/vip-access" 
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Claim VIP
          </a>
          <button 
            onClick={() => setShow(false)} 
            className="px-4 py-2 rounded border hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}