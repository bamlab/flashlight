export type State = {
  value: number;
};

export type Action = {
  type: "change_value";
  payload: number;
};

export const initialState = {
  value: 0,
};

export const percentReducer = (state: State, action: Action) => {
  if (action.type === "change_value") {
    return {
      ...state,
      value: action.payload,
    };
  }
  return state;
};
