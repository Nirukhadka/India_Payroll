"use client";

import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";
import { Bot, ChevronDown, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PayrollContext {
  periodMonth: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalLopDeduction: number;
  totalStatutoryDeductions: number;
  employees?: Array<{
    employeeName: string;
    department: string;
    grossSalary: number;
    netSalary: number;
    lopDeduction: number;
    lopDays: number;
    totalCustomDeductions: number;
    hasSalaryStructure: boolean;
  }>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface AIPayrollAssistantProps {
  payrollContext: PayrollContext;
}

// ─── Suggested Questions ─────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "Summarize this month's payroll",
  "Who has LOP deductions?",
  "Any employees missing salary structure?",
  "What's the highest net salary?",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AIPayrollAssistant({
  payrollContext,
}: AIPayrollAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const buildSystemInstruction = () => {
    const ctx = payrollContext;
    const employeeList = ctx.employees
      ?.map(
        (e) =>
          `  - ${e.employeeName} (${e.department}): Gross ₹${e.grossSalary.toLocaleString("en-IN")}, ` +
          `Net ₹${e.netSalary.toLocaleString("en-IN")}, LOP ₹${e.lopDeduction.toLocaleString("en-IN")} (${e.lopDays} days), ` +
          `Custom Deductions ₹${e.totalCustomDeductions.toLocaleString("en-IN")}, ` +
          `Salary Structure: ${e.hasSalaryStructure ? "Yes" : "NO ⚠️"}`,
      )
      .join("\n");

    return `You are an expert Indian payroll assistant embedded in a payroll management system.
You help HR admins and payroll managers understand their payroll data, flag issues, and answer questions.

CURRENT PAYROLL DATA (${ctx.periodMonth}):
- Total Employees: ${ctx.totalEmployees}
- Total Gross Salary: ₹${ctx.totalGrossSalary.toLocaleString("en-IN")}
- Total LOP Deductions: ₹${ctx.totalLopDeduction.toLocaleString("en-IN")}
- Total Statutory Deductions (PF/ESI/PT): ₹${ctx.totalStatutoryDeductions.toLocaleString("en-IN")}
- Total Net Payable: ₹${ctx.totalNetSalary.toLocaleString("en-IN")}

EMPLOYEE BREAKDOWN:
${employeeList ?? "No employee details available."}

INSTRUCTIONS:
- Answer questions strictly about the payroll data above.
- Always use Indian number formatting (₹ symbol, en-IN locale).
- Be concise and direct. Use bullet points where helpful.
- If asked about statutory rules (PF, ESI, PT, TDS), give accurate Indian statutory info.
- Flag employees with missing salary structures as a risk.
- Never make up data not present above.`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add a streaming placeholder for the assistant
    const assistantPlaceholder: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      // Call our Next.js API route (keeps API key server-side)
      const response = await fetch("/api/ai-payroll-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          systemInstruction: buildSystemInstruction(),
          previousInteractionId,
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let interactionId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text") {
                fullText += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: fullText,
                    streaming: true,
                  };
                  return updated;
                });
              } else if (data.type === "done") {
                interactionId = data.interactionId ?? null;
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }

      // Finalise the message (stop streaming indicator)
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: fullText || "Sorry, I couldn't generate a response.",
          streaming: false,
        };
        return updated;
      });

      if (interactionId) setPreviousInteractionId(interactionId);
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "⚠️ Error: Failed to get a response. Please check your Gemini API key.",
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <Button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-105 transition-transform"
        size="icon"
        title="AI Payroll Assistant"
      >
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-50 w-[380px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">AI Payroll Assistant</p>
                <p className="text-[10px] opacity-70">Powered by Gemini</p>
              </div>
            </div>
            <button type="button"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-primary/60 text-center">
                  Ask me anything about your{" "}
                  <strong>{payrollContext.periodMonth}</strong> payroll data.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button type="button"
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-primary hover:bg-primary/5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}-${msg.content.slice(0, 10)}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-primary rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-1 h-3 ml-0.5 bg-current animate-pulse rounded-sm" />
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/50" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-border p-3 flex gap-2 bg-card">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your payroll…"
              className="flex-1 text-xs h-8"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
