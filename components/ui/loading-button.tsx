import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LoadingButton() {
  return (
    <Button disabled>
      <Spinner className="mr-2" type="circular" size="icon" />
      Please wait
    </Button>
  );
}
