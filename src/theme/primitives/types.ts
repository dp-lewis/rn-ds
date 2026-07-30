/**
 * Shape every brand's primitive palette must satisfy. Adding a brand means
 * filling this in — the type is what stops a brand shipping with a hole in it.
 */

/**
 * Neutral ramp, ordered light to dark. The alias layer picks different steps
 * per mode, which is the whole reason the ramp spans both ends.
 */
export type NeutralRamp = {
  0: string;
  25: string;
  50: string;
  100: string;
  150: string;
  300: string;
  400: string;
  500: string;
  550: string;
  800: string;
  850: string;
  900: string;
  925: string;
  975: string;
};

/**
 * Each hue carries two steps: 600 is dark enough to read on a light surface
 * (and behind white text), 400 is light enough to read on a dark one.
 */
export type HueRamp = {
  400: string;
  600: string;
};

export type HueName = 'azure' | 'teal' | 'violet' | 'green' | 'magenta';

/** Platform font stacks, kept as plain data so this file stays RN-free. */
export type FontFamily = {
  ios?: string;
  android?: string;
  default?: string;
};

export type BrandPrimitives = {
  id: string;
  /** Masthead shown in the UI. */
  name: string;
  fontFamily: {
    /** Wordmark and headlines. Undefined entries fall back to the platform sans. */
    display: FontFamily;
    /** The wire metadata face. */
    mono: FontFamily;
  };
  color: {
    neutral: NeutralRamp;
    critical: HueRamp;
    hue: Record<HueName, HueRamp>;
  };
};
