import { normalize } from "./rules";
import type { Setup, SetupAction } from "./types";

/** Pure state transitions. Every result goes through `normalize`, so the UI can never hold an impossible setup. */
export function setupReducer(state: Setup, action: SetupAction): Setup {
  switch (action.type) {
    case "selectDesk":
      return normalize({ ...state, desk: action.desk });
    case "selectChair":
      return { ...state, chair: action.chair };
    case "setQuantity":
      return normalize({
        ...state,
        accessories: { ...state.accessories, [action.accessory]: action.quantity },
      });
    case "replace":
      return normalize(action.setup);
  }
}
