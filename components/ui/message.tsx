import { Message } from "@/lib/types/message";
import { toTitleCase } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function UserMessageView({ message }: { message: Message }) {
  return (
    <div className="w-full flex flex-row justify-end leading-relaxed">
      <div className="bg-muted/50 p-3 rounded-lg">{message.content}</div>
    </div>
  );
}

function AssistantMessageView({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <ReactMarkdown
        className="leading-relaxed max-w-full prose text-primary prose-headings:text-secondary-foreground prose-strong:text-secondary-foreground prose-blue"
        remarkPlugins={[remarkGfm]}
      >
        {message.content}
      </ReactMarkdown>
      <div className="text-muted-foreground font-bold">Sources</div>
      <div className="flex flex-row gap-2 flex-wrap">
        {message.sources.map((source, idx) => (
          <a
            key={idx}
            className="bg-muted/50 px-3 py-2 rounded-lg transition-all hover:scale-105 cursor-pointer text-sm"
            href={source.url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.article_code}.{source.section_code} -{" "}
            {toTitleCase(source.article_title)}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function MessageView({ message }: { message: Message }) {
  return message.role === "user" ? (
    <UserMessageView message={message} />
  ) : (
    <AssistantMessageView message={message} />
  );
}
