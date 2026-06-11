import { useState } from "react";

import type { YogaProgram } from "./entities/program";
import { ProgramListPage } from "./features/programs/program-library/ProgramListPage";

import { TimerScreenPage } from "./pages/timer";

import "./App.css";
import { SchedulePage } from "./pages/schedule/SchedulePage";

type AppScreen = "programs" | "schedule";

function App() {
  const [screen, setScreen] = useState<AppScreen>("programs");
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

  return (
    <>
      <nav className="appNav" aria-label="Основная навигация">
        <button
          className={
            screen === "programs" ? "appNavButtonActive" : "appNavButton"
          }
          type="button"
          onClick={() => setScreen("programs")}
        >
          Практики
        </button>

        <button
          className={
            screen === "schedule" ? "appNavButtonActive" : "appNavButton"
          }
          type="button"
          onClick={() => setScreen("schedule")}
        >
          Расписание
        </button>
      </nav>

      {screen === "programs" ? (
        <ProgramListPage onOpenProgram={setActiveProgram} />
      ) : (
        <SchedulePage onOpenProgram={setActiveProgram} />
      )}
    </>
  );
}

export default App;
