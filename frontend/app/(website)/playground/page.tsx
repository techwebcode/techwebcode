import Metadata from "next";
import CodePlayground from "@/components/playground/CodePlayground";

export const metadata = {
  title: "HTML & JavaScript Code Playground | TechWebCode",
  description:
    "An interactive, real-time online code playground for HTML, CSS, and JavaScript with VS Code Monaco editor, live preview, and console log debugger.",
};

export default function PlaygroundPage() {
  return <CodePlayground />;
}
