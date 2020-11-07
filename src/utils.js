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
    return new Promise(function(resolve, reject) {
        api.get(url, {
            params,
        })
        .then(res => {
            //console.log(res.data);
            if (res.data.actions) {
                for (let action of res.data.actions ) {
                    //store.dispatch({ type: 'UPDATE_SCHEDULE_SHIFTS', value:{[id]: res.data[id], }})
                    store.dispatch(action)
                    //action.type += 'aaa'
                    //console.log( action.type )
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
