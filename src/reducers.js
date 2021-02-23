//import { combineReducers } from 'redux'

function updateSchedule(state = {}, act) {
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

function updateSalonServices(state = {}, act) {
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

function updatePersons(state = {}, act) {
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

function updateWorkshifts(state = {}, act) {
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

function setCurrentModal(state = null, act) {
	let newState = Object.assign({}, state)
	if (act.type === 'SET_CURRENT_MODAL') {
		newState = act.value
		return newState
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
        schedule: updateSchedule(state.schedule, action),
        salonServices: updateSalonServices(state.salonServices, action),
        persons: updatePersons(state.persons, action),
        workshifts: updateWorkshifts(state.workshifts, action),
		currentModal: setCurrentModal(state.currentModal, action),
        //todos: todos(state.todos, action),
    }
}

export default mainReducer;
