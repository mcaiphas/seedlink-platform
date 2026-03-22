import { AIChatInterface } from '@/components/ai/AIChatInterface';

export default function AskSeedlinkAI() {
  return (
    <AIChatInterface
      assistantType="general"
      title="Ask Seedlink AI"
      placeholder="Ask anything about your business..."
      welcomeMessage="I can help with agronomy, orders, inventory, finance, logistics, and more. What would you like to know?"
      suggestedQuestions={[
        "What inputs do I need for maize in Mpumalanga?",
        "Which products are low in stock?",
        "Show me a summary of today's orders",
        "What is the best fertilizer program for soybean?",
      ]}
    />
  );
}
