import React from 'react';
import { Router, Route, browserHistory } from 'react-router'
import App from './app';
import Registration from './views/party-registration/registration';
import RegisterDetails from './views/register-detial/details';
import PartyDetail from './views/party-detail/details';
import CharmDetail from './views/charm-detail/detail';
import CharmActivity from './views/charm-activity/activity';
import CharmRule from './views/charm-rule/rule';
import CharmShow from './views/charm-show/show';

const Wrap = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/party/register/partyId/:partyId/userId/:userId" component={Registration} />
      <Route path="/party/register/detail/:registerId" component={RegisterDetails} />
      <Route path="/party/detail/:partyid/user/:userid" component={PartyDetail} />
      <Route path="/party/charm/detail" component={CharmDetail} />
      <Route path="/party/charm/activity" component={CharmActivity} />
      <Route path="/party/charm/rule" component={CharmRule} />
      <Route path="/party/charm/show" component={CharmShow} />
    </Route>
  </Router>
);

export default Wrap;
