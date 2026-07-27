import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ReactMarkdown from "react-markdown";

export function MarkdownFile({ relativePath }: { relativePath: string }) {
  const content = readFileSync(join(process.cwd(), relativePath), "utf8");
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
