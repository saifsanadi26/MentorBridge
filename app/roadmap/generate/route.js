import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert Career & Academic Strategist for MentorBridge, a premium mentorship platform for Indian students applying to study abroad.

Your task is to generate a highly personalized, month-by-month roadmap based on the student's specific answers.

CRITICAL RULES:
1. MAIN TIMELINE: Only include unique, phase-based milestone months. Each milestone represents a key transition point.
2. ONGOING MOMENTUM: Create a completely separate section for recurring weekly/monthly habits (Progress Reviews, Networking, etc.). NEVER put these in the main timeline.
3. Calculate exact calendar months based on TODAY'S DATE and the target intake date.
4. Every piece of advice must be specific to the student's destination, field, GPA, work experience, language status, and scholarship goal.
5. Be brutally honest about urgency — if the timeline is tight, say so clearly.

OUTPUT FORMAT (strict JSON, no markdown, no extra text):
{
  "summary": {
    "destination": "string",
    "field": "string", 
    "intake": "string",
    "totalMonths": 0,
    "profileStrength": "STRONG | GOOD | NEEDS WORK",
    "profileNote": "1-2 sentence honest assessment of their profile",
    "urgencyLevel": "CRITICAL | HIGH | MODERATE | RELAXED",
    "urgencyNote": "1 sentence about timeline pressure"
  },
  "stats": [
    {"val": "string", "lbl": "string", "color": "#hex"}
  ],
  "timeline": [
    {
      "monthLabel": "Month 1-2 (Apr-May 2026)",
      "phase": "RESEARCH",
      "phaseColor": "#00D4FF",
      "milestone": "🔍 Profile Assessment Complete",
      "intensity": 3,
      "tasks": [
        {
          "icon": "📊",
          "title": "Task Title",
          "desc": "Specific description",
          "tag": "CRITICAL|REQUIRED",
          "tagColor": "#ff4d6d"
        }
      ]
    }
  ],
  "ongoingMomentum": [
    {
      "icon": "📅",
      "title": "Weekly Task Title",
      "desc": "Description",
      "frequency": "WEEKLY",
      "color": "#00D4FF"
    }
  ],
  "resources": [
    {
      "icon": "🏛",
      "title": "Resource Name",
      "desc": "Why it matters",
      "link": "domain.com"
    }
  ],
  "mentors": [
    {
      "name": "Name",
      "role": "Degree @ University",
      "matchScore": 94,
      "matchReason": "Why they match",
      "img": "https://randomuser.me/api/portraits/men/11.jpg"
    }
  ],
  "warningFlags": [
    {
      "icon": "⚠️",
      "title": "Warning Title",
      "desc": "Specific risk",
      "severity": "HIGH|MEDIUM"
    }
  ]
}

PHASE COLOR GUIDE:
- RESEARCH: #00D4FF
- LANGUAGE/TESTING: #00E5A8  
- APS/DOCUMENTS: #FFB800
- APPLY: #FF5E8A
- WAITING: #7A7F99
- VISA/FINANCIAL: #FFB800
- DEPARTURE: #00E5A8
- ARRIVAL: #00E5A8

TAG COLOR GUIDE:
- CRITICAL: #ff4d6d
- REQUIRED: #ff4d6d
- FUNDING: #FFB800
- HOUSING: #FFB800
- CAREER: #00E5A8
- IMPORTANT: #00D4FF
- RECOMMENDED: #8B7FFF`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { answers } = body;

    if (!answers || !answers.dest || !answers.field) {
      return NextResponse.json({ error: 'Missing required answers' }, { status: 400 });
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const userPrompt = `Today's date: ${todayStr}

Student Profile:
1. Destination: ${answers.dest}
2. Field: ${answers.field}
3. Education: ${answers.edu || 'Not specified'}
4. GPA/Percentage: ${answers.gpa || 75}%
5. Work Experience: ${answers.workex || 'Not specified'}
6. Target Intake: ${answers.intake}
7. Scholarship Goal: ${answers.scholarship || 'Any funding'}
8. Language Status: ${answers.lang || 'Not specified'}

Generate a complete, highly personalized month-by-month roadmap for this student.`;

    const response = await client.messages.create({
      // FIXED THE MODEL NAME HERE:
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText = response.content[0].text;

    // Strip markdown fences if present
    const clean = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const roadmapData = JSON.parse(clean);

    return NextResponse.json({ success: true, roadmap: roadmapData });
  } catch (err) {
    console.error('Roadmap generation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}