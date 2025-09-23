import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { nanoid } from "nanoid";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map();

// Environment validation
const envSchema = z.object({
  VIP_WAITLIST_ENABLED: z.string().default("true"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

// Waitlist form validation schema
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  handle: z.string().optional(),
  phone: z.string().optional(),
  referrer: z.enum(["instagram", "twitter", "site", "friend", "other"]).optional(),
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

// Rate limiting function
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { requests: 1, resetTime: now + windowMs });
    return true;
  }

  const rateLimitInfo = rateLimitMap.get(ip);
  
  if (now > rateLimitInfo.resetTime) {
    rateLimitInfo.requests = 1;
    rateLimitInfo.resetTime = now + windowMs;
    return true;
  }

  if (rateLimitInfo.requests >= maxRequests) {
    return false;
  }

  rateLimitInfo.requests += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment
    const env = envSchema.parse(process.env);
    
    if (env.VIP_WAITLIST_ENABLED !== "true") {
      return NextResponse.json(
        { error: "VIP waitlist is currently disabled" },
        { status: 503 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limit
    if (!rateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    // Initialize Supabase client with service role key
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured. Please contact support." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false }
      }
    );

    // Check if email already exists (idempotent operation)
    const { data: existingEntry } = await supabase
      .from("waitlist_entries")
      .select("id, email, status, created_at")
      .eq("email", validatedData.email)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        {
          message: "Email already registered",
          entry: {
            id: existingEntry.id,
            email: existingEntry.email,
            status: existingEntry.status,
            created_at: existingEntry.created_at,
          },
        },
        { status: 200 }
      );
    }

    // Create new waitlist entry
    const newEntry = {
      email: validatedData.email,
      name: validatedData.name || null,
      handle: validatedData.handle || null,
      phone: validatedData.phone || null,
      referrer: validatedData.referrer || null,
      notes: validatedData.notes || null,
      status: "WAITLISTED",
      priority: "NORMAL",
      source: "vip_form",
    };

    const { data: createdEntry, error } = await supabase
      .from("waitlist_entries")
      .insert(newEntry)
      .select("id, email, status, created_at")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // TODO: Send welcome email if SMTP is configured
    // TODO: Send SMS if Twilio is configured
    
    return NextResponse.json(
      {
        message: "Successfully joined VIP waitlist!",
        entry: {
          id: createdEntry.id,
          email: createdEntry.email,
          status: createdEntry.status,
          created_at: createdEntry.created_at,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("VIP waitlist join error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid form data",
          details: error.errors.map(e => ({ field: e.path.join("."), message: e.message }))
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}