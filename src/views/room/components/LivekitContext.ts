import { useLiveKit } from "@/hooks/useLiveKit";
import { createContext } from "react";
interface LivekitContextType {
  livekit: ReturnType<typeof useLiveKit>;
}
export const LivekitContext = createContext<LivekitContextType>({
  livekit: {} as ReturnType<typeof useLiveKit>,
});
