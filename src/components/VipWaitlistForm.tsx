import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/ui/glass-card";
import { FrostedButton } from "@/components/ui/frosted-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Star, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  handle: z.string().optional(),
  phone: z.string().optional(),
  referrer: z.enum(["instagram", "twitter", "site", "friend", "other"]).optional(),
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  __hp: z.string().max(0, "Bot detected") // Honeypot field
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface VipWaitlistFormProps {
  onSubmit: (data: Omit<WaitlistFormData, '__hp'>) => Promise<void>;
  className?: string;
}

export function VipWaitlistForm({ onSubmit, className }: VipWaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      __hp: "" // Honeypot field
    }
  });

  const acceptTerms = watch("acceptTerms");

  const handleFormSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    try {
      const { __hp, ...submitData } = data;
      await onSubmit(submitData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Waitlist submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <GlassCard className={cn("p-8 text-center", className)} gradient>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Crown className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to the VIP List!</h2>
          <p className="text-muted-foreground">
            You've been added to our exclusive waitlist. We'll notify you when it's your turn to join CABANA.
          </p>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={cn("p-8", className)} gradient blur="lg">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Crown className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Join the VIP Waitlist
          </h1>
          <p className="text-muted-foreground">
            Be among the first to experience CABANA's revolutionary creator platform
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Honeypot field - hidden from users */}
        <input
          {...register("__hp")}
          type="text"
          style={{ position: "absolute", left: "-9999px", opacity: 0 }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
              placeholder="your@email.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle" className="text-foreground font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Social Handle
            </Label>
            <Input
              id="handle"
              {...register("handle")}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
              placeholder="@yourhandle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referrer" className="text-foreground font-medium">
            How did you hear about us?
          </Label>
          <Select onValueChange={(value) => setValue("referrer", value as any)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-foreground backdrop-blur-sm">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="site">Website/SEO</SelectItem>
              <SelectItem value="friend">Friend Referral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-foreground font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Tell us about yourself (optional)
          </Label>
          <Textarea
            id="notes"
            {...register("notes")}
            className="bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground backdrop-blur-sm min-h-[100px]"
            placeholder="What makes you excited about CABANA? What kind of content do you create?"
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue("acceptTerms", !!checked)}
            className="mt-1 border-white/30 data-[state=checked]:bg-white/20"
          />
          <Label htmlFor="acceptTerms" className="text-sm text-foreground leading-relaxed">
            I accept the{" "}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p role="alert" className="text-red-400 text-sm">
            {errors.acceptTerms.message}
          </p>
        )}

        <FrostedButton
          type="submit"
          variant="luxury"
          size="lg"
          glow="medium"
          loading={isSubmitting}
          disabled={isSubmitting || !acceptTerms}
          className="w-full text-lg font-semibold"
          leftIcon={<Crown className="h-5 w-5" />}
        >
          {isSubmitting ? "Joining VIP List..." : "Join VIP Waitlist"}
        </FrostedButton>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Join thousands of creators already on the list</p>
      </div>
    </GlassCard>
  );
}