import { AIChatInterface } from '@/components/ai/AIChatInterface';

export default function OperationsAssistant() {
  return (
    <AIChatInterface
      assistantType="operations"
      title="Operations Assistant"
      placeholder="Ask about orders, deliveries, inventory..."
      welcomeMessage="I help with day-to-day operations — orders, deliveries, stock levels, and logistics coordination."
      suggestedQuestions={[
        "Which orders are pending delivery?",
        "Which depot has fertilizer stock?",
        "What deliveries are scheduled today?",
        "Show me recent stock movements",
      ]}
    />
  );
}
