import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function Popup() {
  return (
    <div className="w-[600px] h-[500px] bg-background">
      <RouterProvider router={router} />
    </div>
  );
}
