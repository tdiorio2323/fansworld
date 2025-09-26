'use client'

import { useState } from 'react'
import FrostedButton from '@/components/FrostedButton'
import GlassCard from '@/components/GlassCard'
import GlassModal from '@/components/GlassModal'
import PendingFeature from '@/components/PendingFeature'
import messagesData from '@/mocks/messages.json'

const conversation = messagesData.conversation

export default function MessagesPage() {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl">Messages</h1>
          <p className="text-sm text-white/70">Preview the conversation shell. Auth and realtime transport are pending.</p>
        </div>
        <FrostedButton size="sm" onClick={() => setModalOpen(true)}>
          New message
        </FrostedButton>
      </header>

      <GlassCard>
        <div className="mb-4 flex flex-col gap-1 text-sm text-white/60">
          <span>Thread · {conversation.participant} &amp; {conversation.creator}</span>
          <span>Secure messaging coming soon</span>
        </div>
        <div className="space-y-6">
          {conversation.messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
                <span>{message.sender}</span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm text-white/80">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-4">
          <label htmlFor="composer" className="text-xs uppercase tracking-[0.4em] text-white/40">
            Composer pending
          </label>
          <textarea
            id="composer"
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70"
            rows={3}
            placeholder="Messaging requires authentication."
            disabled
            title="Auth pending"
          />
        </div>
      </GlassCard>

      <PendingFeature
        title="Realtime delivery will land soon"
        description="Socket transport, read receipts, and typing indicators will go live alongside Supabase auth."
      />

      <GlassModal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="font-display text-2xl">Integration pending</h2>
        <p className="mt-3 text-sm text-white/70">
          Use this layout to refine copy and UI states. The send action will pair with Supabase auth and realtime once
          they enter scope.
        </p>
        <button
          type="button"
          className="btn-reset mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          onClick={() => setModalOpen(false)}
        >
          Close
        </button>
      </GlassModal>
    </div>
  )
}
