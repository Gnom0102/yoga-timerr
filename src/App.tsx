import { useState } from "react";

import type { YogaProgram } from "./entities/program";
import { ProgramListPage } from "./features/programs/program-library/ProgramListPage";
import { SchedulePage } from "./pages/schedule/SchedulePage";
import { TimerScreenPage } from "./pages/timer";
import { AppSidebar } from "./AppSidebar";

import "./App.css";

type AppScreen = "programs" | "schedule";

function App() {
  const [screen, setScreen] = useState<AppScreen>("programs");
  const [activeProgram, setActiveProgram] = useState<YogaProgram | null>(null);
  const [sidebarVersion, setSidebarVersion] = useState(0);

  const refreshSidebar = () => {
    setSidebarVersion((version) => version + 1);
  };

  if (activeProgram) {
    return (
      <TimerScreenPage
        program={activeProgram}
        onBack={() => setActiveProgram(null)}
        onComplete={() => setActiveProgram(null)}
        onOpenPrograms={() => {
          setActiveProgram(null);
          setScreen("programs");
        }}
        onOpenSchedule={() => {
          setActiveProgram(null);
          setScreen("schedule");
        }}
      />
    );
  }

  return (
    <div className="appShell">
      <AppSidebar
        activeScreen={screen}
        sidebarVersion={sidebarVersion}
        onOpenPrograms={() => setScreen("programs")}
        onOpenSchedule={() => setScreen("schedule")}
      />

      <div className="appMainArea">
        <nav className="appTopNav" aria-label="Переключатель страниц">
          <button
            className={
              screen === "programs" ? "appTopNavActive" : "appTopNavButton"
            }
            type="button"
            onClick={() => setScreen("programs")}
          >
            Практики
          </button>

          <button
            className={
              screen === "schedule" ? "appTopNavActive" : "appTopNavButton"
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
          <SchedulePage
            onOpenProgram={setActiveProgram}
            onScheduleChange={refreshSidebar}
          />
        )}
      </div>
    </div>
  );
}

export default App;
