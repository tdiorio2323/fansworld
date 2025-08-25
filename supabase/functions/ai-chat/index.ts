/**
 * SECURE AI CHAT ENDPOINT - Supabase Edge Function
 * 🔒 Server-side AI processing with API key protection
 * 🚀 Consolidated Claude + OpenAI with automatic fallback
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Anthropic } from 'https://esm.sh/@anthropic-ai/sdk@0.57.0'
import OpenAI from 'https://esm.sh/openai@5.11.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt, model, provider, taskType } = await req.json()
    
    // Initialize AI clients with environment variables (server-side only)
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

    let response: string
    let usedModel = model
    let usedProvider = provider

    try {
      // Primary provider attempt
      if (provider === 'claude') {
        const result = await anthropic.messages.create({
          model,
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
        response = result.content[0].type === 'text' ? result.content[0].text : 'No response'
      } else {
        const result = await openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000
        })
        response = result.choices[0]?.message?.content || 'No response'
      }
    } catch (error) {
      console.warn(`${provider} failed, attempting fallback:`, error)
      
      // Automatic fallback to other provider
      if (provider === 'claude') {
        const result = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000
        })
        response = result.choices[0]?.message?.content || 'No response'
        usedModel = 'gpt-4-fallback'
        usedProvider = 'openai'
      } else {
        const result = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
        response = result.content[0].type === 'text' ? result.content[0].text : 'No response'
        usedModel = 'claude-fallback'
        usedProvider = 'claude'
      }
    }

    return new Response(
      JSON.stringify({ 
        response, 
        model: usedModel, 
        provider: usedProvider,
        taskType,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ error: 'AI processing failed', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})