import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ROIResults {
  monthlyRevenue: number;
  onlyFansFee: number;
  cabanaFee: number;
  monthlySavings: number;
  yearlySavings: number;
  cabanaNet: number;
  onlyFansNet: number;
  savingsPercentage: number;
}

export const ROICalculator = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("10000");
  const [showResults, setShowResults] = useState(false);
  
  const calculateROI = (): ROIResults => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    
    // Platform fees
    const onlyFansFeeRate = 0.20; // 20%
    const cabanaFeeRate = revenue > 10000 ? 0.10 : 0; // Free until $10K, then 10%
    
    const onlyFansFee = revenue * onlyFansFeeRate;
    const cabanaFee = revenue * cabanaFeeRate;
    
    const monthlySavings = onlyFansFee - cabanaFee;
    const yearlySavings = monthlySavings * 12;
    
    const cabanaNet = revenue - cabanaFee;
    const onlyFansNet = revenue - onlyFansFee;
    
    const savingsPercentage = revenue > 0 ? (monthlySavings / revenue) * 100 : 0;
    
    return {
      monthlyRevenue: revenue,
      onlyFansFee,
      cabanaFee,
      monthlySavings,
      yearlySavings,
      cabanaNet,
      onlyFansNet,
      savingsPercentage
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const results = calculateROI();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="card-glass overflow-hidden">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-gradient">
            Creator ROI Calculator
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            See how much you'll save by switching from OnlyFans to Cabana
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="text-center">
              <Label htmlFor="revenue" className="text-base font-semibold text-foreground">
                What's your monthly revenue?
              </Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="revenue"
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => {
                    setMonthlyRevenue(e.target.value);
                    setShowResults(true);
                  }}
                  placeholder="10,000"
                  className="pl-12 text-xl font-semibold text-center h-14 text-foreground bg-card/50"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMonthlyRevenue(amount.toString());
                    setShowResults(true);
                  }}
                  className="text-xs hover:bg-primary/10 hover:border-primary/30"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          {showResults && results.monthlyRevenue > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Main Savings Highlight */}
              <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-semibold text-green-400">Monthly Savings</span>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                  {formatCurrency(results.monthlySavings)}
                </div>
                <div className="text-muted-foreground">
                  That's {formatCurrency(results.yearlySavings)} saved per year!
                </div>
                {results.savingsPercentage > 0 && (
                  <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                    {results.savingsPercentage.toFixed(1)}% more profit
                  </Badge>
                )}
              </div>

              {/* Platform Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* OnlyFans */}
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                      OnlyFans
                      <Badge variant="destructive" className="text-xs">20% Fee</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Revenue:</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee:</span>
                      <span className="text-red-400 font-semibold">-{formatCurrency(results.onlyFansFee)}</span>
                    </div>
                    <div className="border-t border-red-500/20 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>You Keep:</span>
                        <span className="text-red-400">{formatCurrency(results.onlyFansNet)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cabana */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                      Cabana
                      <Badge className="text-xs bg-gradient-to-r from-purple-600 to-pink-600">
                        {results.monthlyRevenue <= 10000 ? "FREE" : "10% Fee"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Revenue:</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee:</span>
                      <span className="text-green-400 font-semibold">
                        {results.cabanaFee === 0 ? "FREE" : `-${formatCurrency(results.cabanaFee)}`}
                      </span>
                    </div>
                    <div className="border-t border-purple-500/20 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>You Keep:</span>
                        <span className="text-green-400">{formatCurrency(results.cabanaNet)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Special Offers */}
              {results.monthlyRevenue <= 10000 && (
                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-purple-400">Special Offer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep 100% of your earnings until you hit $10K/month. No fees, no catches!
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg"
                  onClick={() => window.open('/register', '_blank')}
                >
                  Start Saving Today
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Join {Math.floor(Math.random() * 1000) + 2000}+ creators already earning more
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};