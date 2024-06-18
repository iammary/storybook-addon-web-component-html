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

const LIT_EXPRESSION_COMMENTS = /<!--\?lit\$\d+\$-->|<!--\??-->/g;

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

    if (Object.hasOwn((container.children[0] as HTMLElement).dataset, "wcHtmlTab_hide")) {
      litElement = "";
    }

    litElement.replaceAll(LIT_EXPRESSION_COMMENTS, "");

    setTimeout(() => {
      // const rootSelector = parameters.root || "#storybook-root, #root";
      // const root = document.querySelector(rootSelector);

      let code = litElement;

      const { removeEmptyComments = true, removeComments = true, transform } = parameters;
      if (removeEmptyComments) {
        code = code.replaceAll(/<!--\s*-->/g, "");
      }
      if (removeComments === true) {
        code = code.replaceAll(/<!--[\S\s]*?-->/g, "");
      } else if (removeComments instanceof RegExp) {
        code = code.replaceAll(/<!--([\S\s]*?)-->/g, (match: never, p1: string) => (removeComments.test(p1) ? "" : match));
      }
      if (typeof transform === "function") {
        try {
          code = transform(code);
        } catch (error) {
          console.error(error);
        }
      }
      emit(EVENTS.CODE_UPDATE, { code, options: parameters });
    }, 0);
    return story;
  },
});
