// Vite environment variables helper
// Use VITE_*-prefixed variables and coerce to booleans with safe defaults

type EnvBoolean = 'true' | 'false' | undefined;

const coerceBoolean = (value: EnvBoolean, defaultValue: boolean): boolean => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return defaultValue;
};

const env = {
  SHOW_ADD_APPLICATION: coerceBoolean(
    import.meta.env.VITE_SHOW_ADD_APPLICATION as EnvBoolean,
    false
  ),
  SHOW_SEARCH_BUTTON: coerceBoolean(
    import.meta.env.VITE_SHOW_SEARCH_BUTTON as EnvBoolean,
    true
  ),
  SHOW_DEADLINE_BAR: coerceBoolean(
    import.meta.env.VITE_SHOW_DEADLINE_BAR as EnvBoolean,
    true
  ),
};

export default env;


