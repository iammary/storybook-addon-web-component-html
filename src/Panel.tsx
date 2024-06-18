import React, { useMemo, useState } from "react";
import { useAddonState, useChannel, useParameter } from "@storybook/manager-api";
import { ActionBar, AddonPanel } from "@storybook/components";
import { ADDON_ID, EVENTS, PARAM_KEY } from "./constants";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import jsbeautify, { JSBeautifyOptions } from "js-beautify";

export interface WebComponentHtmlPanelProps {
  highlighter?: SyntaxHighlighterProps;
  jsBeautify?: JSBeautifyOptions;
}

export const Panel: React.FC<{ active: boolean }> = props => {
  const [{ code }, setState] = useAddonState(ADDON_ID, {
    code: undefined,
    options: {},
  });

  useChannel({
    [EVENTS.CODE_UPDATE]: ({ code }) => setState(state => ({ ...state, code })),
  });

  const parameters = useParameter<WebComponentHtmlPanelProps>(PARAM_KEY, {});

  const { highlighter, jsBeautify } = parameters;

  const mergedHighlighter = useMemo(
    () => ({
      language: "html",
      showLineNumbers: true,
      ...highlighter,
    }),
    [highlighter],
  );

  const formattedCode = useMemo(
    () =>
      code &&
      jsbeautify.html(code, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 5,
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: "normal",
        brace_style: "collapse",
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: 0,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false,
        ...jsBeautify,
      }),
    [code, jsBeautify],
  );

  const [copied, setCopied] = useState(false);

  const onClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await navigator.clipboard.writeText(formattedCode);

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (!code) {
    return;
  }

  console.log("code: %o", code);

  return (
    <AddonPanel {...props}>
      <ActionBar actionItems={[{ title: copied ? "Copied" : "Copy", onClick }]} />
      <Prism language="html" {...mergedHighlighter}>
        {formattedCode}
      </Prism>
    </AddonPanel>
  );
};
