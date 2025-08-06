import { ConversationMessage } from "@/types/conversation";

/**
 * Utility functions for conversation export
 * Follows Single Responsibility Principle
 */
export class ConversationExporter {
  /**
   * Export conversation as plain text
   */
  static exportAsText(messages: ConversationMessage[]): void {
    const transcript = messages
      .map(
        msg =>
          `[${msg.timestamp.toLocaleTimeString()}] ${msg.speaker.toUpperCase()}: ${msg.content}`
      )
      .join("\n");

    this.downloadFile(transcript, "text/plain", "txt");
  }

  /**
   * Export conversation as JSON
   */
  static exportAsJson(messages: ConversationMessage[]): void {
    const data = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    this.downloadFile(
      JSON.stringify(data, null, 2),
      "application/json",
      "json"
    );
  }

  /**
   * Export conversation as CSV
   */
  static exportAsCsv(messages: ConversationMessage[]): void {
    const headers = ["Timestamp", "Speaker", "Content", "Sentiment"];
    const rows = messages.map(msg => [
      msg.timestamp.toISOString(),
      msg.speaker,
      `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes
      msg.sentiment || "neutral",
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    this.downloadFile(csv, "text/csv", "csv");
  }

  /**
   * Private method to handle file download
   */
  private static downloadFile(
    content: string,
    mimeType: string,
    extension: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split("T")[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get conversation summary
   */
  static getSummary(messages: ConversationMessage[]): {
    totalMessages: number;
    userMessages: number;
    agentMessages: number;
    duration: string;
    wordCount: number;
  } {
    const userMessages = messages.filter(msg => msg.speaker === "user").length;
    const agentMessages = messages.filter(
      msg => msg.speaker === "agent"
    ).length;

    const firstMessage = messages[0]?.timestamp;
    const lastMessage = messages[messages.length - 1]?.timestamp;
    const duration =
      firstMessage && lastMessage
        ? `${Math.round((lastMessage.getTime() - firstMessage.getTime()) / 1000 / 60)} minutes`
        : "0 minutes";

    const wordCount = messages.reduce(
      (total, msg) => total + msg.content.split(" ").length,
      0
    );

    return {
      totalMessages: messages.length,
      userMessages,
      agentMessages,
      duration,
      wordCount,
    };
  }
}
