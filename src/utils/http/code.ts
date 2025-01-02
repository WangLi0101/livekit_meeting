import type { ResponseData } from ".";
import { toast } from "sonner";
export function handleCode(res: ResponseData<string>) {
  switch (res.code) {
    default:
      toast.error(res.message);
      break;
  }
}
