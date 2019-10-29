/// <reference types="parcel-env" />

import React from "react"
import ReactDOM from "react-dom"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import SmoothScroll from "smoothscroll-polyfill"
import CircularProgress from "@material-ui/core/CircularProgress"
import { MuiThemeProvider } from "@material-ui/core/styles"
import AndroidBackButton from "./components/AndroidBackButton"
import ErrorBoundary from "./components/ErrorBoundary"
import LinkHandler from "./components/LinkHandler"
import { VerticalLayout } from "./components/Layout/Box"
import DesktopNotifications from "./components/DesktopNotifications"
import NotificationContainer from "./components/NotificationContainer"
import { AccountsProvider } from "./context/accounts"
import { CachingProviders } from "./context/caches"
import { NotificationsProvider } from "./context/notifications"
import { SettingsProvider } from "./context/settings"
import { SignatureDelegationProvider } from "./context/signatureDelegation"
import { StellarProvider } from "./context/stellar"
import handleSplashScreen from "./splash-screen"
import theme from "./theme"

SmoothScroll.polyfill()

const pages = {
  account: import("./pages/account"),
  allAccounts: import("./pages/all-accounts"),
  createAccount: import("./pages/create-account"),
  settings: import("./pages/settings")
}

const AllAccountsPage = React.lazy(() => pages.allAccounts)
const AccountPage = React.lazy(() => pages.account)
const CreateAccountPage = React.lazy(() => pages.createAccount)
const SettingsPage = React.lazy(() => pages.settings)

const CreateMainnetAccount = () => <CreateAccountPage testnet={false} />
const CreateTestnetAccount = () => <CreateAccountPage testnet={true} />

const Providers = (props: { children: React.ReactNode }) => (
  <Router>
    <MuiThemeProvider theme={theme}>
      <StellarProvider>
        <AccountsProvider>
          <SettingsProvider>
            <CachingProviders>
              <NotificationsProvider>
                <SignatureDelegationProvider>{props.children}</SignatureDelegationProvider>
              </NotificationsProvider>
            </CachingProviders>
          </SettingsProvider>
        </AccountsProvider>
      </StellarProvider>
    </MuiThemeProvider>
  </Router>
)

const App = () => (
  <Providers>
    <>
      <VerticalLayout height="100%" style={{ WebkitOverflowScrolling: "touch" }}>
        <VerticalLayout height="100%" grow overflowY="hidden">
          <ErrorBoundary>
            <React.Suspense fallback={<CircularProgress />}>
              <Switch>
                <Route exact path="/" component={AllAccountsPage} />
                <Route exact path="/account/create/mainnet" component={CreateMainnetAccount} />
                <Route exact path="/account/create/testnet" component={CreateTestnetAccount} />
                <Route
                  path={["/account/:id/:action/:subaction", "/account/:id/:action", "/account/:id"]}
                  render={props => <AccountPage accountID={props.match.params.id} />}
                />
                <Route exact path="/settings" component={SettingsPage} />
              </Switch>
            </React.Suspense>
          </ErrorBoundary>
        </VerticalLayout>
      </VerticalLayout>
      {/* Notifications need to come after the -webkit-overflow-scrolling element on iOS */}
      <DesktopNotifications />
      <NotificationContainer />
      {process.env.PLATFORM === "android" ? <AndroidBackButton /> : null}
      {process.env.PLATFORM === "android" || process.env.PLATFORM === "ios" ? <LinkHandler /> : null}
    </>
  </Providers>
)

const onRendered = () => {
  if (window.parent) {
    // for Cordova
    window.parent.postMessage("app:ready", "*")
  }
}

ReactDOM.render(<App />, document.getElementById("app"), onRendered)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

handleSplashScreen()
