import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

/* lorsque nous appelons useAuth() dans notre code, nous obtenons les détails sur l'authentification de l'utilisateur. Si nous avons besoin de savoir si un utilisateur est authentifié ou non, nous utilisons cette fonction useAuth et elle nous dit la réponse.

LE CONTEXTE 
En React, le contexte est un moyen de partager des données entre différents composants sans avoir à les passer explicitement de parent en enfant à travers les props. Le contexte est particulièrement utile lorsque plusieurs composants ont besoin d'accéder aux mêmes données.

AuthContext est le contexte que vous avez importé à partir du fichier "AuthProvider". Ce contexte contient des informations sur l'authentification de l'utilisateur, telles que son statut de connexion ou ses données d'identification
*/

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;