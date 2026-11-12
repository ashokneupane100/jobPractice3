"use server";

import { currentUser } from "@clerk/nextjs/server";
import { generateGeminiText, parseGeminiJson } from "@/lib/gemini";

const CATEGORY_PROMPTS = {
  FRONTEND: "React, JavaScript, CSS, performance, accessibility, browser APIs",
  BACKEND:
    "Node.js, REST APIs, databases, authentication, caching, scalability",
  FULLSTACK:
    "full-stack architecture, API design, state management, deployment",
  DSA: "data structures, algorithms, time complexity, problem solving",
  SYSTEM_DESIGN:
    "distributed systems, scalability, databases, microservices, caching",
  BEHAVIORAL:
    "leadership, teamwork, conflict resolution, career growth, STAR method",
  DEVOPS: "CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring",
  MOBILE:
    "React Native, iOS/Android, performance, offline support, app lifecycle",
};

export const generateInterviewQuestions = async ({ category }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (!category || !CATEGORY_PROMPTS[category])
    throw new Error("Invalid category");

  const prompt = `You are an expert technical interviewer. Generate 6 interview questions for a ${category} role covering: ${CATEGORY_PROMPTS[category]}.

For each question, provide a concise but complete answer (2-4 sentences) that an interviewer can use to evaluate responses.

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation. Example format:
[{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}]`;

  const text = await generateGeminiText(prompt);
  const parsed = parseGeminiJson(text);

  if (!Array.isArray(parsed)) {
    throw new Error("The AI returned an unexpected response. Please try again.");
  }

  const questions = parsed
    .filter((item) => item && typeof item.question === "string")
    .slice(0, 6)
    .map((item) => ({
      question: item.question,
      answer:
        typeof item.answer === "string" && item.answer.trim()
          ? item.answer
          : "No answer provided.",
    }));

  if (questions.length === 0) {
    throw new Error("The AI returned no questions. Please try again.");
  }

  return { questions };
};
