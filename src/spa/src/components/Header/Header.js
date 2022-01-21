import React from 'react';
import { withRouter } from "react-router-dom";

function Header(props) {
  const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
  }
  let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))

  if(props.location.pathname === '/') {
    title = 'Welcome'
  }

  function renderLogout() {
    if(props.location.pathname === '/'){
      return(
        <div className="ml-auto">
          <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
        </div>
      )
    }
  }

  function handleLogout() {
    // TODO: Find a way to truly log out, not just delete local token
    // const { store } = this.context;
    // const state = store.getState();
    // state.cognito.user.signOut();

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)
    props.updateTitle('Login')
    props.history.push('/login')
  }

  return(
    <nav className="navbar navbar-dark bg-primary">
      <div className="row col-12 d-flex justify-content-center text-white">
        <span className="h3">{props.title || title}</span>
        {renderLogout()}
      </div>
    </nav>
  )
}
export default withRouter(Header);
