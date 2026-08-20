export type ScopeBriefTab = "product" | "api";

export interface ScopeBriefSection {
  id: string;
  tab: ScopeBriefTab;
  title: string;
  defaultContent: string;
  dataContent?: string;
  dataOfflineNote?: string;
}

export const SCOPE_BRIEF_SECTIONS: ScopeBriefSection[] = [
  {
    id: "overview",
    tab: "product",
    title: "Overview",
    defaultContent: `AgOS Field Scouting helps agronomists and farm operators capture structured field observations from mobile devices while walking a crop.

This prototype covers a single scouting session: log observations by type (disease, pest, weed, moisture, other, population), review the field log, and end the session with a hold-to-confirm action.

Design intent: fast capture in the field, minimal typing, structured data for downstream agronomy workflows.`,
  },
  {
    id: "personas",
    tab: "product",
    title: "Personas & goals",
    defaultContent: `Primary user: Field scout / agronomist walking a crop block.

Goals:
• Start a scouting task quickly from a task list
• Log observations with type-specific detail without leaving the field
• Attach photos, video, and voice notes where helpful
• Review all observations grouped by type before ending the session
• End session deliberately (hold to confirm) to avoid accidental closure`,
  },
  {
    id: "log-observation",
    tab: "product",
    title: "Log an observation",
    defaultContent: `The log an observation screen is the entry point of the scouting session.

The user sees a hard-coded breakdown of the observation types they can record:
• Disease — signs of infection on the crop
• Pest — insects or animals causing damage
• Weed — unwanted plants in the field
• Moisture — soil moisture at depth
• Other — general notes, photos, or issues outside the above
• Population — plant population count using the method configured for the project

Notes
1) Any observation made during the session is recorded under the scouting session. 
2) The user taps a specific tile to progress into that flow.
3) User is able to swipe to the right of this page to see a list of all observations that have been recorded during this session
4) The user can end the session by holding the "End session" button at the bottom of the page
`,
  },
  {
    id: "disease-selection",
    tab: "product",
    title: "Disease selection",
    defaultContent:`The user browses or searches crop-filtered disease groups and specific diseases.

They can 
• Select a Disease group from the displayed tiles and be taken to the disease detail form input page
• Use the search bar to find either a specific disease or a disease group and select this
• Select "Note sure / Other" and be taken to the disease detail form input page with a promt to add an image. 

Note
These will be displayed OFFLINE meaning that the data needs to be completed passed to the mobile app which will store it in session, and apply any filters on the front end!!`
  },
  {
    id: "disease-detail",
    tab: "product",
    title: "Disease detail form",
    defaultContent: `After selecting a disease group (with or without a specific disease), the user completes the detail form and submits.

Captured on this form:
• Flag for whether this needs following up or not
• Ability to select a specific disease if not already selected
• Where do you see it
• How far has it spread
• How many plants show it
• How badly is each plant affected
• Images
• Notes

Note
1) Submitting saves the observation to the current scouting session
2) It also captures the CURRENT GPS location of the user.`

  },
  {
    id: "pest-selection",
    tab: "product",
    title: "Pest selection",
    defaultContent: `The user browses or searches crop-filtered pest groups and specific pests.

They can
• Select a pest group from the displayed tiles and be taken to the pest detail form input page
• Use the search bar to find either a specific pest or a pest group and select this
• Select "Not sure / Other" and be taken to the pest detail form input page with a prompt to add an image

Note
These will be displayed OFFLINE meaning that the data needs to be completely passed to the mobile app which will store it in session, and apply any filters on the front end.`,
  },
  {
    id: "pest-detail",
    tab: "product",
    title: "Pest detail form",
    defaultContent: `After selecting a pest group (with or without a specific pest), the user completes the detail form and submits.

Captured on this form:
• Flag for whether this needs following up or not
• Ability to select a specific pest if not already selected
• Which part of the plant is infected
• How far has it spread
• How many plants show it
• How bad is the damage on each plant
• Images
• Notes

Note
1) Submitting saves the observation to the current scouting session
2) It also captures the CURRENT GPS location of the user.`,
  },
  {
    id: "weed-selection",
    tab: "product",
    title: "Weed selection",
    defaultContent: `The user browses or searches crop-filtered weed groups and specific weeds.

They can
• Select a weed group from the displayed tiles and be taken to the weed detail form input page
• Use the search bar to find either a specific weed or a weed group and select this
• Select "Not sure / Other" and be taken to the weed detail form input page with a prompt to add an image

Note
These will be displayed OFFLINE meaning that the data needs to be completely passed to the mobile app which will store it in session, and apply any filters on the front end.`,
  },
  {
    id: "weed-detail",
    tab: "product",
    title: "Weed detail form",
    defaultContent: `After selecting a weed group (with or without a specific weed), the user completes the detail form and submits.

Captured on this form:
• Flag for whether this needs following up or not
• Ability to select a specific weed if not already selected
• Weed size
• Weed density
• Images
• Notes

Note
1) Submitting saves the observation to the current scouting session
2) It also captures the CURRENT GPS location of the user.`,
  },
  {
    id: "moisture-check",
    tab: "product",
    title: "Moisture check",
    defaultContent: `The user checks soil moisture at up to four depth levels:

• 0–20 cm
• 20–40 cm
• 40–60 cm
• 60–80 cm

For each depth, they select a moisture level on the scale (Dust, Dry, Ideal, Wet, Mud) and save that depth.

The user can submit at any time using "Finish moisture check now" once at least one depth has been logged. They do not need to complete all four — but a minimum of one depth reading is required before submit.

Note
1) Submitting saves the observation to the current scouting session
2) It also captures the CURRENT GPS location of the user.`,
  },
  {
    id: "population-count",
    tab: "product",
    title: "Population count",
    defaultContent: `The user records a plant population count using the method already configured for the project. Only one method is available at a time:

• Square — count plants inside a quadrat whose size is defined in the backend (prototype: 0.5 m × 0.5 m)
• 10 m row — count plants along a 10 metre row

The user enters the plant count and saves. Density is calculated from the configured sample size (plants/m² for a square, plants/m for a row).

In this prototype the two methods alternate each time Population is opened, to demonstrate both. In production a project would lock to a single method.

Note
1) Submitting saves the observation to the current scouting session
2) It also captures the CURRENT GPS location of the user.`,
  },
  {
    id: "flows",
    tab: "product",
    title: "Field log",
    defaultContent: `Swipe right from the log observation screen to view the field log.

Observations are grouped by type (Disease, Pest, Weed, etc.) with expandable cards showing the details captured for each entry.

The user can open a map overlay to see observation locations within the field.`,
  },
  {
    id: "ux-patterns",
    tab: "product",
    title: "UX patterns & decisions",
    defaultContent: `• Mobile-first phone frame; on desktop the app sits left in a split workspace beside this brief.
• Log observation screen: hard-coded type breakdown at top; voice note tile hidden (inline voice on detail pages only).
• Observation tiles: 2×2-style cards with theme-colored borders; counts shown as badges.
• Hold interactions: hold 3s to end session; hold to record inline voice notes on detail pages.
• Disease/Pest/Weed taxonomy filtered by session crop; grouped list with search and add-if-missing.
• Field log: grouped by observation type (not a timeline).
• Media: images and videos attach to observations; videos marked pending analysis.`,
  },
  {
    id: "entities",
    tab: "api",
    title: "Core entities",
    defaultContent: `ScoutingTask
  id, title, project, category, location, commodity, fieldId

ScoutingSession
  id, taskId, fieldId, startedAt, endedAt?, status (active | completed)

ScoutingObservation
  id, sessionId, type, note, createdAt, location?, type-specific details

ObservationLocation
  latitude, longitude

ObservationMediaItem
  id, type (image | video), url, name, pendingAnalysis?

VoiceNoteDetails
  audioUrl, durationSeconds, media?

Type-specific detail objects:
  DiseaseObservationDetails, PestObservationDetails, WeedObservationDetails,
  MoistureObservationDetails, OtherObservationDetails, PopulationObservationDetails`,
  },
  {
    id: "endpoints",
    tab: "api",
    title: "REST endpoints",
    defaultContent: `Auth
  POST   /auth/login              { email, password } → { token, user }
  POST   /auth/logout             → 204

Tasks
  GET    /scouting/tasks          ?search= → ScoutingTask[]
  GET    /scouting/tasks/:id      → ScoutingTask

Sessions
  POST   /scouting/sessions       { taskId } → ScoutingSession
  GET    /scouting/sessions/:id   → ScoutingSession
  PATCH  /scouting/sessions/:id   { status: "completed", endedAt } → ScoutingSession

Observations
  GET    /scouting/sessions/:sessionId/observations → ScoutingObservation[]
  POST   /scouting/sessions/:sessionId/observations → ScoutingObservation
  GET    /scouting/observations/:id → ScoutingObservation

Media
  POST   /media/upload            multipart → ObservationMediaItem
  POST   /media/voice-notes       multipart audio → { url, durationSeconds }

Taxonomy (crop-filtered)
  GET    /crops/:cropId/disease-groups     → DiseaseGroup[] (groups with nested diseases)
  GET    /crops/:cropId/disease-groups?q=  → grouped search results
  POST   /crops/:cropId/diseases           → add disease to group (when not found in list)
  GET    /crops/:cropId/pest-groups        → PestGroup[]
  GET    /crops/:cropId/weed-groups        → WeedGroup[]`,
  },
  {
    id: "payloads",
    tab: "api",
    title: "Observation payloads",
    defaultContent: `POST /scouting/sessions/:sessionId/observations

{
  "type": "disease" | "pest" | "weed" | "moisture" | "other" | "population" | "voice_note",
  "note": "string",
  "location": { "latitude": number, "longitude": number },
  "diseaseDetails": { ... } | null,
  "pestDetails": { ... } | null,
  "weedDetails": { ... } | null,
  "moistureDetails": { ... } | null,
  "otherDetails": { "media": ObservationMediaItem[] } | null,
  "populationDetails": {
    "method": "square" | "row",
    "plantCount": number,
    "squareWidthMeters": number,
    "squareHeightMeters": number,
    "rowLengthMeters": number
  } | null,
  "voiceNoteDetails": { "audioUrl": "string", "durationSeconds": number, "media": [] } | null
}

Disease/Pest/Weed detail objects include category + species IDs, scale fields (1–5),
infected parts / plant locations, flags, otherNotes, optional voiceNote, and media[].

Validation rules (prototype):
• Disease/Pest/Weed require at least one location/part selection before save
• Moisture requires depth + reading
• Population requires a plant count (0 is valid)
• Voice note requires audioUrl + durationSeconds`,
  },
  {
    id: "open-questions",
    tab: "api",
    title: "Open questions",
    defaultContent: `• Offline sync strategy for field areas with poor connectivity?
• Video analysis pipeline — webhook callback vs polling?
• Taxonomy source of truth for disease/pest/weed species (CMS vs API)?
• Session auto-save interval and conflict resolution?
• Geolocation: device GPS vs field polygon snap-to-boundary?
• Auth: SSO / farm org tenancy model?`,
  },
];

export function getScopeBriefSection(id: string): ScopeBriefSection | undefined {
  return SCOPE_BRIEF_SECTIONS.find((section) => section.id === id);
}
