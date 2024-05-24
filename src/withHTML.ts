import { EVENTS, PARAM_KEY } from "./constants";
import { makeDecorator, useChannel } from "@storybook/preview-api";
import { ReactNode } from "react";
import { render as litRender } from "lit";

export interface WithHTMLParameters {
  root?: string;
  removeEmptyComments?: boolean;
  removeComments?: boolean | RegExp;
  transform?: (code: string) => string;
  showRawSource?: boolean;
}

const LIT_EXPRESSION_COMMENTS = /<!--\?lit\$[0-9]+\$-->|<!--\??-->/g;

export const withHTML = makeDecorator({
  name: "withHTML",
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  wrapper: (storyFn, context, { parameters = {} }: { parameters: WithHTMLParameters }) => {
    const emit = useChannel({});
    const story = storyFn(context) as ReactNode;

    const container = window.document.createElement("div");

    litRender(story, container);
    let litElement = container.children[0].outerHTML;

    if (container.children[0].hasAttribute("data-wc-html-tab_hide")) {
      litElement = "";
    }

    litElement.replace(LIT_EXPRESSION_COMMENTS, "");

    setTimeout(() => {
      // const rootSelector = parameters.root || "#storybook-root, #root";
      // const root = document.querySelector(rootSelector);

      let code = litElement;

      const { removeEmptyComments = true, removeComments = true, transform } = parameters;
      if (removeEmptyComments) {
        code = code.replace(/<!--\s*-->/g, "");
      }
      if (removeComments === true) {
        code = code.replace(/<!--[\S\s]*?-->/g, "");
      } else if (removeComments instanceof RegExp) {
        code = code.replace(/<!--([\S\s]*?)-->/g, (match: any, p1: string) => (removeComments.test(p1) ? "" : match));
      }
      if (typeof transform === "function") {
        try {
          code = transform(code);
        } catch (e) {
          console.error(e);
        }
      }
      emit(EVENTS.CODE_UPDATE, { code, options: parameters });
    }, 0);
    return story;
  },
});
