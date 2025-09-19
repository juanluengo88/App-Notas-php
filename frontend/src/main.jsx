import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NotesApp from "./App";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<NotesApp />
	</StrictMode>
);
