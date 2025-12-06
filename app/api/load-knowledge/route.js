// app/api/load-knowledge/route.js 

import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server'; // Import NextResponse for App Router responses

// --- A. THE KNOWLEDGE CHUNKS (Your company data) ---
const rawKnowledgeChunks = [
    // --- Program and Course Details ---
    "The main program is called 'Talk & Win,' a results-driven communication mastery program designed to help users speak with clarity, influence, and unstoppable confidence.",
    "The core offering is the '3C Course: Master Communication, Confidence and Courage.' This course transforms your mindset and personality for personal and professional success.",
    "The 3C Course includes: Role Play, 1 hour of on-demand video, Assignments, Full lifetime access, and a Certificate of completion. It has 4 sections and 22 lectures.",
    "The 3C Course focuses on: Building strong self-confidence, expressing thoughts effectively, understanding the link between C's (Communication, Confidence, Courage), communicating assertively, and developing clear communication skills.",
    "The program is ideal for: Curious individuals, Corporate professionals, Coaches/Creators, Career Builders, Change-Makers, and Courage-Seekers (those overcoming fear).",

    // --- Instructor Details ---
    "The instructor is Trupti Warjurkar, a communication strategist, speaker, and coach. She is the voice behind Talk & Win.",
    "Trupti helps professionals unlock their voice, combining psychology, storytelling, and practical speaking techniques. She has guided over 1000+ professionals and entrepreneurs.",
    "Trupti is known for her 'Inspower Method' — turning insight into action. She was also honored as Runner-Up at Miss Maharashtra.",

    // --- Demo Class Details ---
    "The Demo Class is 'Master Your Voice - Free Demo Class,' an interactive session to experience confident communication.",
    "The price of the demo class is **₹99**, with no hidden charges. It includes a 90-minute Live Interactive Session, Expert Guidance, Practical Exercises, a Certificate of Participation, and Lifetime Access to the Recording.",
    "What you'll learn in the demo: Voice modulation techniques, Body language basics, Confidence building tips, and Public speaking essentials.",
    "Demo Class FAQ: Yes, the demo class is **really ₹99**.",
    "Demo Class FAQ: All registered participants will receive a **recording link** within 24 hours after the session ends. The recording will be available for 7 days.",
    "Demo Class FAQ: Yes, questions are encouraged during dedicated Q&A segments.",
    "Demo Class FAQ: You'll need a laptop or desktop with a stable internet connection and a free Zoom account. The meeting link is sent 24 hours before the session.",
    "Demo Class FAQ: After the demo, attendees receive information on full courses and special offers, with no obligation to enroll.",
    
    // --- Customer Support Protocol ---
    "**Customer Support Protocol for Payment or Flag Issues:** For problems like payment failure or website flags, we have recorded your details and shared your problem with our team. If the issue is not resolved, please send a detailed email to: **contact.talkandwin@gmail.com**."
];

// --- B. THE DATA LOADING LOGIC (Exported as a GET handler) ---
export async function GET() {
    
    // Make sure we have the required keys
    if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json({ error: 'Missing API Keys in .env file.' }, { status: 500 });
    }

    try {
        // 1. Initialize Clients (Use Service Role Key for security)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY 
        );

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        console.log('Starting knowledge embedding...');
        
        // Optional: Clear existing documents before loading new ones
        const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0); 
        if (deleteError) {
             console.error("Error clearing documents:", deleteError.message);
        }
        
        let successCount = 0;
        let errorCount = 0;

        // 2. Loop through all chunks
        for (const chunk of rawKnowledgeChunks) {
            try {
                // Generate Embedding (Vector)
                const embeddingResponse = await openai.embeddings.create({
                    model: "text-embedding-3-small", 
                    input: chunk,
                });

                const embedding = embeddingResponse.data[0].embedding;

                // Insert the text and the vector into Supabase
                const { error } = await supabase.from('documents').insert({
                    content: chunk,
                    embedding: embedding,
                });

                if (error) {
                    errorCount++;
                    console.error("Error inserting chunk:", error.message);
                } else {
                    successCount++;
                }

            } catch (e) {
                errorCount++;
                console.error(`Error processing chunk: ${chunk.substring(0, 50)}...`, e.message);
            }
        }

        console.log('Knowledge embedding complete!');
        
        return NextResponse.json({ 
            message: 'Knowledge Base Loaded Successfully!', 
            total_chunks: rawKnowledgeChunks.length,
            successful_inserts: successCount,
            errors: errorCount
        }, { status: 200 });

    } catch (e) {
        console.error("Critical error during setup:", e.message);
        return NextResponse.json({ error: 'Failed to run embedding process.', details: e.message }, { status: 500 });
    }
}