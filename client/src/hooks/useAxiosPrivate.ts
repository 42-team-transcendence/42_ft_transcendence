import { axiosPrivate } from "../api/axios"
import { useEffect } from "react"
import useRefreshToken from "./useRefreshToken"
import useAuth from "./useAuth"

function useAxiosPrivate() {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		// =============================================================================
		// Intercepteur de requête =====================================================

		/* Les intercepteurs de requête vérifient si nous avons une autorisation appelée "Authorization" dans les en-têtes de la demande. Si nous n'en avons pas, ils l'ajoutent en utilisant le jeton d'accès (auth.accessToken) que nous avons reçu auparavant. Cela nous permet d'envoyer la demande avec les bonnes autorisations.*/

		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			}, (error) => Promise.reject(error)
		);


		// =============================================================================
		// Intercepteur de réponse =====================================================

		/* Les intercepteurs de réponse sont comme des gardiens qui écoutent les réponses que nous recevons. Si nous recevons une réponse avec un code de statut 403 (ce qui signifie "Accès refusé"), cela peut signifier que notre autorisation a expiré. Dans ce cas, les intercepteurs demandent un nouveau jeton d'accès (refresh()) et ajoutent cette nouvelle autorisation à la demande précédente. Ensuite, ils renvoient cette demande pour qu'elle soit envoyée à nouveau avec les bonnes autorisations. */

		const responseIntercept = axiosPrivate.interceptors.response.use(
			response => response,
			async(error) => {
				const prevRequest = error?.config;
				if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
					prevRequest.sent = true;
					console.log("await refresh token");
					const newAccessToken = await refresh();
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);


		// =============================================================================
		//  Nettoyage des intercepteurs lors du démontage ==============================
		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);

		}
	}, [auth, refresh])

	return axiosPrivate;

}

export default useAxiosPrivate




