import { AIChatInterface } from '@/components/ai/AIChatInterface';

export default function FinanceAssistant() {
  return (
    <AIChatInterface
      assistantType="finance"
      title="Finance Assistant"
      placeholder="Ask about revenue, receivables, profitability..."
      welcomeMessage="I provide financial insights — revenue, margins, aging, cash flow, and accounting guidance."
      suggestedQuestions={[
        "What is our revenue this month?",
        "Which customers have overdue payments?",
        "What is our fertilizer margin?",
        "Summarize accounts receivable aging",
      ]}
    />
  );
}
