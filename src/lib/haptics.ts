import { WebHaptics } from "web-haptics";

let instance: WebHaptics | null = null;

function getHaptics(): WebHaptics {
  if (!instance) {
    instance = new WebHaptics({
      debug: process.env.NODE_ENV === "development",
    });
  }
  return instance;
}

export const isHapticsSupported = WebHaptics.isSupported;

/** Play the built-in "nudge" haptic preset (vibration + debug audio in dev). */
export function triggerNudge(): void {
  void getHaptics().trigger("nudge");
}
