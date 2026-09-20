declare module "@base-ui/react/use-render" {
  import * as React from "react";
  export const useRender: any;
  export namespace useRender {
    export type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> = {
      render?: React.ReactElement | ((props: any) => React.ReactElement);
    } & React.ComponentPropsWithoutRef<T>;
  }
}
