import { AIChatInterface } from '@/components/ai/AIChatInterface';

export default function KnowledgeAssistant() {
  return (
    <AIChatInterface
      assistantType="knowledge"
      title="Knowledge Assistant"
      placeholder="Ask about best practices, training, guides..."
      welcomeMessage="I help you learn — agricultural best practices, platform guides, and training content."
      suggestedQuestions={[
        "How do I create a crop plan in Seedlink?",
        "What are the best practices for maize storage?",
        "Explain the recommendation engine workflow",
        "How does credit control work?",
      ]}
    />
  );
}
