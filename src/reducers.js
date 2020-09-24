//import { combineReducers } from 'redux'

function setSchedule(state = {}, act) {
    if (act.type === 'SET_SCHEDULE') {
        let newState = Object.assign({}, state);
        act.value.updated = new Date();
        newState[act.id] = act.value;
        return newState;
    }
    return state;
}
/*
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
} */

/*
const mainReducer = combineReducers({
    visibilityFilter,
    todos
}) */

function mainReducer(state = {}, action) {
    return {
        schedule: setSchedule(state.schedule, action),
        //todos: todos(state.todos, action),
    }
}

export default mainReducer;
