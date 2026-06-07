import { ProgramListPage } from "./features/programs/program-library/ProgramListPage";

import "./App.css";
import { useState } from "react";
import { TimerScreenPage } from "./pages/timer";
import type { YogaProgram } from "./entities/program";

function App() {
  const [activeProgram, setActiveProgram] = useState<YogaProgram | null>(null);

  if (activeProgram) {
    return (
      <TimerScreenPage
        program={activeProgram}
        onBack={() => setActiveProgram(null)}
        onComplete={() => setActiveProgram(null)}
      />
    );
  }

  return <ProgramListPage onOpenProgram={setActiveProgram} />;
}

export default App;
