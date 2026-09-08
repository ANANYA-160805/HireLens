import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router";

const Protected = ({children}) => {
  const { loading, user } = useAuth();

    if(loading){
    return (
      <main className="loading-screen" aria-busy="true" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading...</p>
      </main>
    )
  }

  if(!user){
      return <Navigate to="/login" replace={true} />
  }

  return children;
}

export default Protected
