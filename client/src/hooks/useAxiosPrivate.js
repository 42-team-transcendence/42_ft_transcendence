import { axiosPrivate } from "../api/axios"
import { useEffect } from "react"
import useRefreshToken from "./useRefreshToken"
import useAuth from "./useAuth"

/*
The axios.interceptors.request.use() and axios.interceptors.response.use() methods are both used to intercept HTTP requests and responses, but they are applied at different stages of the request lifecycle and serve different purposes:

axios.interceptors.request.use(): This method is used to intercept and modify the request configuration before the request is sent to the server. It allows you to add headers, modify the URL, attach authentication tokens, or perform any other transformations on the request. It is typically used to add global headers or authentication tokens that need to be included in every outgoing request. The request interceptor is executed before the request is sent.

axios.interceptors.response.use(): This method is used to intercept and process the response returned by the server before it is passed to the application code. It allows you to handle common response transformations or error handling logic in a centralized manner. You can modify the response data, check for errors, perform logging, or implement any custom logic based on the response. The response interceptor is executed after the response is received from the server but before it is passed to the .then() or .catch() handlers. 
*/


/* 
What are axios interceptors

Axios interceptors are functions that allow you to intercept and modify HTTP requests or responses globally before they are handled by your application. They provide a way to add custom logic or transformations to requests or responses across your entire Axios instance.

Axios interceptors can be useful in various scenarios, such as:

Authentication: You can use an interceptor to automatically add authentication headers to outgoing requests based on the user's authentication status or access token.

Logging: Interceptors can log incoming requests and outgoing responses for debugging purposes or to collect analytics data.

Error handling: You can use interceptors to globally handle and process specific error responses, such as handling unauthorized requests or redirecting to a login page.

*/

function useAxiosPrivate() {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {

		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			}, (error) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			response => response,
			async(error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);

		}
	}, [auth, refresh])

	return axiosPrivate;

}

export default useAxiosPrivate