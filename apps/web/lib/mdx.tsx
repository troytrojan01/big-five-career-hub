import { Fragment } from "react";

function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-ink/10 px-1 py-0.5 text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export function renderMdx(source: string) {
  const lines = source.split("\n");
  const content: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) {
      return;
    }

    content.push(
      <ul key={`list-${content.length}`} className="space-y-2">
        {listItems.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      content.push(
        <h2 key={`heading-${content.length}`} className="font-serif text-3xl text-ink">
          {renderInline(line.slice(3))}
        </h2>,
      );
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      content.push(
        <h3 key={`heading-${content.length}`} className="text-2xl font-semibold text-ink">
          {renderInline(line.slice(4))}
        </h3>,
      );
      return;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }

    flushList();
    content.push(
      <p key={`paragraph-${content.length}`} className="leading-8 text-slate">
        {renderInline(line)}
      </p>,
    );
  });

  flushList();

  return {
    content: <>{content}</>,
  };
}
