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
		let t = new Date()
		for (let cat_key in act.value) {
			let cat = act.value[cat_key]
			//console.log(key, act.value[key])
			if (newState[cat_key]) {
				for (let key in cat.services) {
					let serv = cat.services[key]
					serv.updated = t
					newState[cat_key].services[key] = serv
				}
			}
			else {
				cat.updated = t
				newState[cat_key] = cat
			}
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

function updateMySalons(state = {}, act) {
	let newState = Object.assign({}, state)
	if (act.type === 'UPDATE_MY_SALONS') {
		newState = act.value
		return newState;
	}
	return state
}

function setLoginSession(state = {}, act) {
	let newState = Object.assign({}, state)
	if (act.type === 'SET_LOGIN_SESSION') {
		newState = act.value
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
		loginSession: setLoginSession(state.loginSession, action),
		currentModal: setCurrentModal(state.currentModal, action),
		mySalons: updateMySalons(state.mySalons, action),
        //todos: todos(state.todos, action),
    }
}

export default mainReducer;
