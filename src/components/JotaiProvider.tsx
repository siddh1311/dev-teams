"use client";

import { Provider } from "jotai";

interface JotaiProviderProps {
  children: React.ReactNode;
}

/**
 * A convenience component that wraps the Jotai Provider and passes the state
 * and actions to the children. This is the simplest way to use the Jotai state
 * management system with Next.js.
 *
 * @example
 * import { JotaiProvider } from '@/components/JotaiProvider';
 *
 * const App = () => (
 *   <JotaiProvider>
 *     <MyComponent />
 *   </JotaiProvider>
 * );
 *
 * @param {JotaiProviderProps} props
 * @returns {React.ReactElement}
 */
export const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return <Provider>{children}</Provider>;
};
