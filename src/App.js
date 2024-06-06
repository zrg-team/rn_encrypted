import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './pages/MainPage';

const NewPage = React.lazy(() => import('./pages/NewPage'));

// Other imports...

function App() {
  return (
    <div>
      <Router>
        <Switch>
          {/* Other route definitions... */}
          <Route exact path="/new-page" render={() => (
            <React.Suspense fallback={<div>Loading...</div>}>
              <NewPage />
            </React.Suspense>
          )} />
          {/* Add more routes as needed */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;