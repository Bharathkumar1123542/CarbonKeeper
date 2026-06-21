"use client";
import { useChat } from "@/lib/hooks/useChat";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { LoadingIndicator } from "@/components/chat/LoadingIndicator";
import { EmptyState } from "@/components/chat/EmptyState";
import { useActivityStore } from "@/lib/stores/activity-store";

export default function AssistantPage() {
  const activities = useActivityStore((s) => s.activities);
  const {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    inputRef,
    sendMessage,
    handleSubmit,
  } = useChat({ activities });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2 flex items-center gap-3">
              AI Climate Assistant
            </h1>
            <p className="text-muted font-medium">
              Ask anything about your carbon footprint. Get answers grounded in
              your real data.
            </p>
          </header>

          <EmptyState activities={activities} />

          <SuggestedPrompts
            onSendMessage={sendMessage}
            activities={activities}
            messages={messages}
          />

          <div className="space-y-6">
            <ChatMessages messages={messages} />

            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </div>
  );
}