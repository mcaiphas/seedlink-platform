import { AIChatInterface } from '@/components/ai/AIChatInterface';

export default function AgronomyAssistant() {
  return (
    <AIChatInterface
      assistantType="agronomy"
      title="Agronomy Assistant"
      placeholder="Ask about crops, soil, fertilizers, pest control..."
      welcomeMessage="I'm your agronomy specialist. Ask me about crop production, soil management, fertilizer programs, spray schedules, and more."
      suggestedQuestions={[
        "What's the best maize hybrid for dryland farming?",
        "How should I interpret my soil analysis results?",
        "Design a spray program for soybean rust",
        "What lime rate do I need for pH 4.8 soil?",
      ]}
    />
  );
}
