export const getUrl = () =>
  window.location.href.replace(window.location.origin, "");

type TStateCondition = "auth-error" | "auth-success";

interface IState {
  from: string;
  existing: string;
  condition: TStateCondition;
}

export type TState = IState | null;

export const getRedirectUrlFromState = (state: TState) =>
  state?.existing || state?.from || "/feed";
