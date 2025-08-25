import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Copy, CheckCircle, Lightbulb, MessageSquare, Mail, User } from 'lucide-react'
import { generateBio, generateCaption, generateSubscriptionTier, generateEmail, getContentIdeas } from '@/lib/ai-engine'
import { useToast } from '@/hooks/use-toast'

const AIContentGenerator = () => {
  const [activeTab, setActiveTab] = useState<'bio' | 'caption' | 'subscription' | 'email' | 'ideas'>('bio')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Form states
  const [bioForm, setBioForm] = useState({ name: '', niche: '', personality: 'confident' })
  const [captionForm, setCaptionForm] = useState({ contentType: '', mood: 'engaging' })
  const [subscriptionForm, setSubscriptionForm] = useState({ tierName: '', price: '', benefits: '' })
  const [emailForm, setEmailForm] = useState({ type: 'welcome' as const, creatorName: '' })
  const [ideasForm, setIdeasForm] = useState({ niche: '', count: '5' })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    toast({ title: "Copied to clipboard!", description: "Content ready to use" })
    setTimeout(() => setCopied(false), 2000)
  }

  const generateBioContent = async () => {
    setIsLoading(true)
    try {
      const content = await generateBio(bioForm.name, bioForm.niche, bioForm.personality)
      setResult(content.content)
      toast({ title: "Bio generated!", description: `Using ${content.metadata?.model}` })
    } catch (error) {
      toast({ title: "Generation failed", description: "Please check your API keys", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateCaptionContent = async () => {
    setIsLoading(true)
    try {
      const content = await generateCaption(captionForm.contentType, captionForm.mood)
      setResult(content.content)
      toast({ title: "Caption generated!", description: `Using ${content.metadata?.model}` })
    } catch (error) {
      toast({ title: "Generation failed", description: "Please check your API keys", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateSubscriptionContent = async () => {
    setIsLoading(true)
    try {
      const benefits = subscriptionForm.benefits.split(',').map(b => b.trim()).filter(Boolean)
      const content = await generateSubscriptionTier(subscriptionForm.tierName, parseFloat(subscriptionForm.price), benefits)
      setResult(content.content)
      toast({ title: "Subscription copy generated!", description: `Using ${content.metadata?.model}` })
    } catch (error) {
      toast({ title: "Generation failed", description: "Please check your API keys", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateEmailContent = async () => {
    setIsLoading(true)
    try {
      const content = await generateEmail(emailForm.type, emailForm.creatorName)
      setResult(content.content)
      toast({ title: "Email generated!", description: `Using ${content.metadata?.model}` })
    } catch (error) {
      toast({ title: "Generation failed", description: "Please check your API keys", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateIdeasContent = async () => {
    setIsLoading(true)
    try {
      const ideas = await getContentIdeas(ideasForm.niche, parseInt(ideasForm.count))
      setResult(ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n\n'))
      toast({ title: "Content ideas generated!", description: `${ideas.length} ideas ready` })
    } catch (error) {
      toast({ title: "Generation failed", description: "Please check your API keys", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'bio' as const, label: 'Creator Bio', icon: User },
    { id: 'caption' as const, label: 'Social Caption', icon: MessageSquare },
    { id: 'subscription' as const, label: 'Subscription Copy', icon: Sparkles },
    { id: 'email' as const, label: 'Fan Email', icon: Mail },
    { id: 'ideas' as const, label: 'Content Ideas', icon: Lightbulb }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI Content Creator</h1>
        <p className="text-gray-600">Powered by your Hybrid AI Engine - automatically chooses the best AI for each task</p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="secondary">Claude 3.5 Sonnet</Badge>
          <Badge variant="secondary">GPT-4</Badge>
          <Badge variant="outline">Auto-Fallback</Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => {
                setActiveTab(tab.id)
                setResult('')
              }}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'bio' && <User className="w-5 h-5" />}
              {activeTab === 'caption' && <MessageSquare className="w-5 h-5" />}
              {activeTab === 'subscription' && <Sparkles className="w-5 h-5" />}
              {activeTab === 'email' && <Mail className="w-5 h-5" />}
              {activeTab === 'ideas' && <Lightbulb className="w-5 h-5" />}
              {tabs.find(t => t.id === activeTab)?.label}
            </CardTitle>
            <CardDescription>
              {activeTab === 'bio' && "Generate a magnetic creator bio that converts visitors"}
              {activeTab === 'caption' && "Create engaging social media captions with hashtags"}
              {activeTab === 'subscription' && "Write compelling copy for subscription tiers"}
              {activeTab === 'email' && "Generate personalized emails for your fans"}
              {activeTab === 'ideas' && "Get unlimited content ideas for your niche"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Bio Form */}
            {activeTab === 'bio' && (
              <>
                <div>
                  <Label htmlFor="name">Creator Name</Label>
                  <Input
                    id="name"
                    value={bioForm.name}
                    onChange={(e) => setBioForm({...bioForm, name: e.target.value})}
                    placeholder="Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="niche">Niche/Category</Label>
                  <Input
                    id="niche"
                    value={bioForm.niche}
                    onChange={(e) => setBioForm({...bioForm, niche: e.target.value})}
                    placeholder="fitness, lifestyle, gaming, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="personality">Personality</Label>
                  <Select value={bioForm.personality} onValueChange={(value) => setBioForm({...bioForm, personality: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="mysterious">Mysterious</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateBioContent} disabled={isLoading || !bioForm.name || !bioForm.niche} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Bio
                </Button>
              </>
            )}

            {/* Caption Form */}
            {activeTab === 'caption' && (
              <>
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Input
                    id="contentType"
                    value={captionForm.contentType}
                    onChange={(e) => setCaptionForm({...captionForm, contentType: e.target.value})}
                    placeholder="workout video, behind-the-scenes, product review"
                  />
                </div>
                <div>
                  <Label htmlFor="mood">Mood/Tone</Label>
                  <Select value={captionForm.mood} onValueChange={(value) => setCaptionForm({...captionForm, mood: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engaging">Engaging</SelectItem>
                      <SelectItem value="funny">Funny</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateCaptionContent} disabled={isLoading || !captionForm.contentType} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                  Generate Caption
                </Button>
              </>
            )}

            {/* Subscription Form */}
            {activeTab === 'subscription' && (
              <>
                <div>
                  <Label htmlFor="tierName">Tier Name</Label>
                  <Input
                    id="tierName"
                    value={subscriptionForm.tierName}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, tierName: e.target.value})}
                    placeholder="VIP Access, Premium, Exclusive"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($/month)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={subscriptionForm.price}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, price: e.target.value})}
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                  <Textarea
                    id="benefits"
                    value={subscriptionForm.benefits}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, benefits: e.target.value})}
                    placeholder="exclusive content, direct messaging, custom videos, priority support"
                    rows={3}
                  />
                </div>
                <Button onClick={generateSubscriptionContent} disabled={isLoading || !subscriptionForm.tierName} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Copy
                </Button>
              </>
            )}

            {/* Email Form */}
            {activeTab === 'email' && (
              <>
                <div>
                  <Label htmlFor="emailType">Email Type</Label>
                  <Select value={emailForm.type} onValueChange={(value: 'welcome' | 'exclusive' | 'milestone') => setEmailForm({...emailForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="exclusive">Exclusive Content</SelectItem>
                      <SelectItem value="milestone">Milestone Celebration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="creatorName">Creator Name</Label>
                  <Input
                    id="creatorName"
                    value={emailForm.creatorName}
                    onChange={(e) => setEmailForm({...emailForm, creatorName: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                <Button onClick={generateEmailContent} disabled={isLoading || !emailForm.creatorName} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Generate Email
                </Button>
              </>
            )}

            {/* Ideas Form */}
            {activeTab === 'ideas' && (
              <>
                <div>
                  <Label htmlFor="ideaNiche">Niche/Topic</Label>
                  <Input
                    id="ideaNiche"
                    value={ideasForm.niche}
                    onChange={(e) => setIdeasForm({...ideasForm, niche: e.target.value})}
                    placeholder="fitness, cooking, travel, tech"
                  />
                </div>
                <div>
                  <Label htmlFor="count">Number of Ideas</Label>
                  <Select value={ideasForm.count} onValueChange={(value) => setIdeasForm({...ideasForm, count: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Ideas</SelectItem>
                      <SelectItem value="10">10 Ideas</SelectItem>
                      <SelectItem value="15">15 Ideas</SelectItem>
                      <SelectItem value="20">20 Ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateIdeasContent} disabled={isLoading || !ideasForm.niche} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  Generate Ideas
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Content
              {result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Your AI-generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Fill out the form and click generate to see your AI-powered content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AIContentGenerator