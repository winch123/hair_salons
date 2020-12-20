//import { combineReducers } from 'redux'

function schedule(state = {}, act) {
    let newState = Object.assign({}, state);
    if (act.type === 'UPDATE_SCHEDULE_SHIFTS') {
        for (let key in act.value) {
            act.value[key].updated = new Date()
            newState[key] = act.value[key]
        }
        return newState;
    }
    return state;
}

function salonServices(state = {}, act) {
    let newState = Object.assign({}, state)
    if (act.type === 'UPDATE_SALON_SERVICES') {
        for (let key in act.value) {
            //console.log(key, act.value[key])
            act.value[key].updated = new Date()
            newState[key] = act.value[key]
        }
        return newState;
    }
    return state
}

function persons(state = {}, act) {
    let newState = Object.assign({}, state)
    if (act.type === 'UPDATE_PERSONS') {
        for (let key in act.value) {
            //console.log(key, act.value[key])
            act.value[key].updated = new Date()
            newState[key] = act.value[key]
        }
        return newState;
    }
    return state
}

function workshifts(state = {}, act) {
    let newState = Object.assign({}, state)
    if (act.type === 'UPDATE_WORKSHIFTS') {
        for (let key in act.value) {
            //console.log(key, act.value[key])
            act.value[key].updated = new Date()
            newState[key] = act.value[key]
        }
        return newState;
    }
    return state
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
        schedule: schedule(state.schedule, action),
        salonServices: salonServices(state.salonServices, action),
        persons: persons(state.persons, action),
        workshifts: workshifts(state.workshifts, action),
        //todos: todos(state.todos, action),
    }
}

export default mainReducer;
