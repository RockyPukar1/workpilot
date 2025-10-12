import { QueryProvider } from "@/shared/components/query-provider";
import { Popup } from "./Popup";

function App() {
  return (
    <QueryProvider>
      <Popup />
    </QueryProvider>
  );
}

export default App;
