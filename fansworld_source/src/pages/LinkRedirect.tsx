import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function LinkRedirect() {
  const { shortCode } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

      try {
        // Get the original URL
        const { data: linkData, error: linkError } = await supabase
          .from('link_tracking')
          .select('*')
          .eq('short_code', shortCode)
          .eq('is_active', true)
          .single();

        if (linkError || !linkData) {
          setError("Link not found or has expired");
          setLoading(false);
          return;
        }

        // Check if link is expired
        if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
          setError("This link has expired");
          setLoading(false);
          return;
        }

        // Record the click
        const userAgent = navigator.userAgent;
        const referer = document.referrer;
        
        // Basic device detection
        let deviceType = 'desktop';
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
          deviceType = /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'mobile';
        }

        // Basic browser detection
        let browser = 'unknown';
        if (userAgent.includes('Chrome')) browser = 'chrome';
        else if (userAgent.includes('Firefox')) browser = 'firefox';
        else if (userAgent.includes('Safari')) browser = 'safari';
        else if (userAgent.includes('Edge')) browser = 'edge';

        // Basic OS detection
        let os = 'unknown';
        if (userAgent.includes('Windows')) os = 'windows';
        else if (userAgent.includes('Mac')) os = 'macos';
        else if (userAgent.includes('Linux')) os = 'linux';
        else if (userAgent.includes('Android')) os = 'android';
        else if (userAgent.includes('iOS')) os = 'ios';

        // Record the click (fire and forget)
        try {
          await supabase
            .from('link_clicks')
            .insert({
              link_id: linkData.id,
              short_code: shortCode,
              user_agent: userAgent,
              referer: referer || null,
              device_type: deviceType,
              browser: browser,
              os: os,
              session_id: sessionStorage.getItem('session_id') || Math.random().toString(36)
            });
        } catch (clickError) {
          console.error('Click tracking error:', clickError);
        }

        setTargetUrl(linkData.original_url);
        
        // Redirect after a brief delay to allow click recording
        setTimeout(() => {
          window.location.href = linkData.original_url;
        }, 500);

      } catch (error) {
        console.error('Redirect error:', error);
        setError("An error occurred while processing the link");
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="backdrop-blur-xl bg-black/20 border border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">Redirecting...</h2>
            <p className="text-gray-400">
              Please wait while we redirect you to your destination.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="backdrop-blur-xl bg-black/20 border border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Link Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10 max-w-md w-full">
        <CardContent className="p-8 text-center">
          <ExternalLink className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Redirecting to:</h2>
          <p className="text-purple-300 mb-6 break-all">{targetUrl}</p>
          <p className="text-gray-400 text-sm">
            If you are not redirected automatically, click the button below.
          </p>
          <Button 
            onClick={() => targetUrl && (window.location.href = targetUrl)}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue to Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}