"use client";

import { useEffect, useState } from "react";
import { useAppHeader } from "@/components/AppHeaderContext";
import { FieldExplorePage } from "@/components/FieldExplorePage";
import { FieldOverviewPage } from "@/components/FieldOverviewPage";
import { FieldSelectPage } from "@/components/FieldSelectPage";
import { ScoutingHomePage } from "@/components/ScoutingHomePage";
import { ScoutingSessionView } from "@/components/ScoutingSessionView";
import {
  appendFieldObservations,
  getInitialFieldObservations,
} from "@/lib/field-observations";
import { getFieldById } from "@/lib/fields";
import { ScoutingObservation } from "@/lib/observations";

type ScoutingScreen =
  | { name: "home" }
  | { name: "start-field-select" }
  | { name: "session"; fieldId: string }
  | { name: "explore-fields" }
  | { name: "field-overview"; fieldId: string };

export function ScoutingSection() {
  const { setHeaderConfig } = useAppHeader();
  const [screen, setScreen] = useState<ScoutingScreen>({ name: "home" });
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [fieldObservations, setFieldObservations] = useState<
    Record<string, ScoutingObservation[]>
  >(() => getInitialFieldObservations());

  useEffect(() => {
    if (screen.name === "home") {
      setHeaderConfig({ title: "Scouting", showBack: false });
      return;
    }

    if (screen.name === "start-field-select") {
      setHeaderConfig({
        title: "Select a field",
        showBack: true,
        onBack: () => {
          setSelectedFieldId(null);
          setScreen({ name: "home" });
        },
      });
      return;
    }

    if (screen.name === "explore-fields") {
      setHeaderConfig({
        title: "Explore fields",
        showBack: true,
        onBack: () => setScreen({ name: "home" }),
      });
      return;
    }

    if (screen.name === "field-overview") {
      const field = getFieldById(screen.fieldId);
      setHeaderConfig({
        title: field?.name ?? "Field overview",
        showBack: true,
        onBack: () => setScreen({ name: "explore-fields" }),
      });
      return;
    }

    if (screen.name === "session") {
      const field = getFieldById(screen.fieldId);
      setHeaderConfig({
        title: field?.name ?? "Scouting",
        showBack: false,
      });
    }
  }, [screen, setHeaderConfig]);

  function handleStartSession() {
    if (!selectedFieldId) return;
    setScreen({ name: "session", fieldId: selectedFieldId });
  }

  function handleEndSession(
    fieldId: string,
    sessionObservations: ScoutingObservation[]
  ) {
    setFieldObservations((current) =>
      appendFieldObservations(current, fieldId, sessionObservations)
    );
    setSelectedFieldId(null);
    setScreen({ name: "home" });
  }

  if (screen.name === "session") {
    const field = getFieldById(screen.fieldId);
    if (!field) {
      return (
        <ScoutingHomePage
          onStartScouting={() => setScreen({ name: "start-field-select" })}
          onExploreFields={() => setScreen({ name: "explore-fields" })}
        />
      );
    }

    return (
      <ScoutingSessionView
        field={field}
        onEndSession={(observations) =>
          handleEndSession(screen.fieldId, observations)
        }
      />
    );
  }

  if (screen.name === "start-field-select") {
    return (
      <FieldSelectPage
        subtitle="Choose where you want to carry out scouting"
        actionLabel="Start"
        selectedFieldId={selectedFieldId}
        onSelectField={setSelectedFieldId}
        onConfirm={handleStartSession}
      />
    );
  }

  if (screen.name === "explore-fields") {
    return (
      <FieldExplorePage
        onSelectField={(fieldId) =>
          setScreen({ name: "field-overview", fieldId })
        }
      />
    );
  }

  if (screen.name === "field-overview") {
    return (
      <FieldOverviewPage
        fieldId={screen.fieldId}
        observations={fieldObservations[screen.fieldId] ?? []}
      />
    );
  }

  return (
    <ScoutingHomePage
      onStartScouting={() => setScreen({ name: "start-field-select" })}
      onExploreFields={() => setScreen({ name: "explore-fields" })}
    />
  );
}
