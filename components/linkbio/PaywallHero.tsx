
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui
import { Creator } from '@/lib/types';

interface PaywallHeroProps {
  creator: Creator;
  isVIP: boolean;
  onUnlock: () => void;
}

export function PaywallHero({ creator, isVIP, onUnlock }: PaywallHeroProps) {
  return (
    <div className="panel-glass rounded-2xl max-w-md w-full mx-auto p-6 my-8 shadow-neon-violet flex flex-col items-center text-center">
      <img src={creator.avatarUrl} alt={creator.username} className="w-24 h-24 rounded-full border-2 border-neon-aqua shadow-neon-aqua mb-3" />
      <h1 className="text-iridescent text-3xl font-bold"> @{creator.username}</h1>
      <p className="text-slate-300 mt-1 mb-4">{creator.tagline}</p>

      <div className={`relative my-4 w-full rounded-lg overflow-hidden border border-white/10 shadow-lg`}>
        <img src={creator.heroMediaUrl} alt="VIP Content" className={`w-full transition-all duration-500 ${isVIP ? '' : 'blur-md opacity-60'}`} />
        {!isVIP && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-iridescent text-2xl font-black uppercase tracking-widest">VIP Only</span>
          </div>
        )}
      </div>

      <div className="mt-4 w-full">
        {isVIP ? (
          <Button disabled className="w-full h-14 text-lg font-bold cursor-default opacity-80 bg-iridescent text-black">Welcome, VIP</Button>
        ) : (
          <Button onClick={onUnlock} className="w-full h-14 bg-iridescent text-black text-lg font-bold shadow-neon-aqua hover:opacity-90 transition-opacity">
            Unlock for ${creator.subscriptionPrice}/mo
          </Button>
        )}
      </div>
    </div>
  );
}
