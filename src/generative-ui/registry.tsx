import { WorldClockWidget, RestWorldClockWidget } from "./widgets";

export type UiDecision = {
  component: "world_clock" | "rest_world_clock" | "unsupported";
  confidence: number;
  source: "jev" | "demo";
};

const components = {
  world_clock: WorldClockWidget,
  rest_world_clock: RestWorldClockWidget,
  unsupported: UnsupportedWidget,
} as const;

function UnsupportedWidget() {
  return (
    <div className="empty-state">
      <span className="surface-eyebrow">NO MATCHING COMPONENT</span>
      <h3>This prompt needs a different kind of view.</h3>
      <p>Try asking “what time is it?” to generate the world clock.</p>
    </div>
  );
}

export function GeneratedSurface({ decision }: { decision: UiDecision }) {
  const Component = components[decision.component] ?? components.unsupported;
  return (
    <div className="generated-surface">
      <Component />
      <div className="surface-caption">
        <span>RENDERED FROM A REGISTERED COMPONENT</span>
        <span>CONFIDENCE {(decision.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
