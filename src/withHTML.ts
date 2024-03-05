import { EVENTS, PARAM_KEY } from "./constants";
import { makeDecorator, useChannel } from "@storybook/preview-api";

export interface WithHTMLParameters {
  root?: string;
  removeEmptyComments?: boolean;
  removeComments?: boolean | RegExp;
  transform?: (code: string) => string;
}

export const withHTML = makeDecorator({
  name: "withHTML",
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  wrapper: (storyFn, context, { parameters = {} }: { parameters: WithHTMLParameters }) => {
    const emit = useChannel({});
    setTimeout(() => {
      const rootSelector = parameters.root || "#storybook-root, #root";
      const root = document.querySelector(rootSelector);
      let code = root ? root.innerHTML : `${rootSelector} not found.`;
      const { removeEmptyComments, removeComments, transform } = parameters;
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
    return storyFn(context);
  },
});
