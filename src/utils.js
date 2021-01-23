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
			//console.log(url, res.status)
            if (res.data.actions) {
                for (let action of res.data.actions ) {
                    //store.dispatch({ type: 'UPDATE_SCHEDULE_SHIFTS', value:{[id]: res.data[id], }})
                    store.dispatch({type: action.type, value: action.value})
                }
            }
            if (res.data.redirect) {
                apiRequest(res.data.redirect.url, res.data.redirect.params || null)
            }
			if (res.data.message) {
				notification.open({
					message: res.data.message.title,
					description: res.data.message.text,
					onClick: () => {
					console.log('Notification Clicked!')
					},
					duration: 4,
					icon: {
						info: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
						ok: <CheckCircleOutlined style={{ color: 'green' }} />,
						warning: <WarningOutlined style={{ color: 'red' }} />,
					}[res.data.message.iconType],
					style: {backgroundColor: 'Cornsilk'},
				})
			}

            resolve(res.data)
        })
		.catch(error => {
			//console.log(url)
			//console.log(error.response)
			//console.log(error.request)
			//console.log(error.message)
			if (error.response.status === 403) {
				history.push('/login')
			}
		})
    })
}

export {api, apiRequest}
