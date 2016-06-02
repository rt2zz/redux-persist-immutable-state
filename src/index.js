import { Map } from 'immutable';

export const lastStateInit = new Immutable.Map();

export function stateIterator(state, callback) {
  return state.forEach(callback);
}

export function stateGetter(state, key) {
 return state.get(key)
};

export function stateSetter(state, key, value) {
 return state.set(key, value)
};

export function stateReconciler(state, inboundState, reducedState, logger) {
 let newState = new Map();

 Object.keys(inboundState).forEach((key) => {
   // if initialState does not have key, skip auto rehydration
   if (!state.has(key)) return

   // if reducer modifies substate, skip auto rehydration
   if (state.get('key') !== reducedState.get('key')) {
     if (logger) console.log('redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key)
     newState = newState.set(key, reducedState.get(key))
     return
   }

   // otherwise take the inboundState
   if (state.has(key)) {
     newState = state.merge(inboundState) // shallow merge
   } else {
     newState = state.set(key, inboundState[key]) // hard set
   }

   if (logger) console.log('redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key])
 })

 return newState
};
