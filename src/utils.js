import axios from "axios"
import { createStore } from 'redux'
import mainReduser from './reducers'

let api = axios.create({
  // baseURL: "http://hair-salons.local/salon/",
  baseURL: "http://hair-salons.local/api/",
  responseType: "json"
});

const store = createStore(mainReduser, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//const unsubscribe = store.subscribe(() => console.info( {...store.getState()} ));

export {store}

const apiRequest = function(url, params={}) {
    params = Object.assign(params, {salonId: 2})
    return new Promise(function(resolve, reject) {
        api.get(url, {
            params,
            headers: {
              'Test-Header': 'test-value',
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem("token") || null,
            },
        })
        .then(res => {
            //console.log(res.data);
            if (res.data.actions) {
                for (let action of res.data.actions ) {
                    //store.dispatch({ type: 'UPDATE_SCHEDULE_SHIFTS', value:{[id]: res.data[id], }})
                    store.dispatch({type: action.type, value: action.value})
                }
            }
            if (res.data.redirect) {
                apiRequest(res.data.redirect.url, res.data.redirect.params || null)
            }

            resolve(res.data)
        })
    })
}

export {api, apiRequest}
