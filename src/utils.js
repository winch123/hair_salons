import axios from "axios"
import { createStore } from 'redux'
import mainReduser from './reducers'
import React from 'react'
import { notification } from 'antd'
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
export {history}

let api = axios.create({
  // baseURL: "http://hair-salons.local/salon/",
  //baseURL: "http://hair-salons.local/api/",
  baseURL: "https://hs.local/api/",
  responseType: "json"
});

const store = createStore(mainReduser, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//const unsubscribe = store.subscribe(() => console.info( {...store.getState()} ));

export {store}

export function dispatch(type, value) {
	store.dispatch({type, value})
}

const apiRequest = function(url, params={}) {
    params = Object.assign(params, {salonId: store.getState().salon.id})
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
			//console.log(url, res.status, res)
			const data = res.data || {}
            if (data.actions) {
                for (let action of data.actions ) {
                    //store.dispatch({ type: 'UPDATE_SCHEDULE_SHIFTS', value:{[id]: data[id], }})
                    store.dispatch({type: action.type, value: action.value})
                }
            }
            if (data.redirect) {
                apiRequest(data.redirect.url, data.redirect.params || null)
            }
			if (data.message) {
				notification.open({
					message: data.message.title,
					description: data.message.text,
					onClick: () => {
					console.log('Notification Clicked!')
					},
					duration: 4,
					icon: {
						info: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
						ok: <CheckCircleOutlined style={{ color: 'green' }} />,
						warning: <WarningOutlined style={{ color: 'red' }} />,
					}[data.message.iconType],
					style: {backgroundColor: 'Cornsilk'},
				})
			}

            resolve(data)
        })
		.catch(error => {
			console.log('error', url, error)
			//console.log(error.response)
			//console.log(error.request)
			//console.log(error.message)
			if (error.response && [403,401].indexOf(error.response.status) > -1) {
				history.push('/login')
				resolve(error)
			}
			reject(error)
		})
    })
}

export {api, apiRequest}
