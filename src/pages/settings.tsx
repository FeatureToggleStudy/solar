import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { AccountsContext } from "../context/accounts"
import { SettingsContext } from "../context/settings"
import { Box, VerticalLayout } from "../components/Layout/Box"
import MainTitle from "../components/MainTitle"
import ToggleSection from "../components/Layout/ToggleSection"
import { Section } from "../components/Layout/Page"
import { useIsMobile, useRouter } from "../hooks/userinterface"
import { biometricLockAvailable } from "../platform/settings"
import * as routes from "../routes"

// tslint:disable-next-line
const pkg = require("../../package.json")

function Settings() {
  const { accounts } = React.useContext(AccountsContext)
  const settings = React.useContext(SettingsContext)
  const hasTestnetAccount = accounts.some(account => account.testnet)

  return (
    <>
      <ToggleSection
        disabled={!settings.biometricLockUsable}
        checked={settings.biometricLock && settings.biometricLockUsable}
        onChange={settings.toggleBiometricLock}
        style={biometricLockAvailable ? {} : { display: "none" }}
        title={process.env.PLATFORM === "ios" ? "Face ID / Touch ID" : "Fingerprint Lock"}
      >
        <Typography
          color={settings.biometricLock ? "initial" : "textSecondary"}
          style={{ margin: "8px 0 0" }}
          variant="body2"
        >
          Enable this option to lock the app whenever you leave it. Unlock it using biometric authentication (usually
          your fingerprint).
        </Typography>
      </ToggleSection>
      <ToggleSection
        checked={settings.showTestnet}
        disabled={hasTestnetAccount}
        onChange={settings.toggleTestnet}
        title="Show Testnet Accounts"
      >
        <Typography
          color={settings.showTestnet ? "initial" : "textSecondary"}
          style={{ margin: "8px 0 0" }}
          variant="body2"
        >
          The test network is a copy of the main Stellar network were the traded tokens have no real-world value. You
          can request free testnet XLM from the so-called friendbot to activate a testnet account and get started
          without owning any actual funds.
        </Typography>
        <Typography
          color={settings.showTestnet ? "initial" : "textSecondary"}
          style={{ margin: "12px 0 0" }}
          variant="body2"
        >
          Note: Testnet accounts will always be shown if you have got testnet accounts already.
        </Typography>
      </ToggleSection>
      <ToggleSection
        checked={settings.hideMemos}
        onChange={settings.toggleHideMemos}
        title="Hide memos in transactions overview"
      >
        <Typography
          color={settings.hideMemos ? undefined : "textSecondary"}
          style={{ margin: "8px 0 0" }}
          variant="body2"
        >
          Memos are text messages that can be included with transactions. Enable this option to hide them in the
          overview. They will still be shown in the detailed view of a transaction.
        </Typography>
      </ToggleSection>
      <ToggleSection
        checked={settings.multiSignature}
        onChange={settings.toggleMultiSignature}
        title="Enable Multi-Signature"
      >
        <Typography
          color={settings.multiSignature ? "initial" : "textSecondary"}
          style={{ margin: "8px 0 0" }}
          variant="body2"
        >
          <b>Experimental feature:</b> Add co-signers to an account, define that all signers of an account have to sign
          transactions unanimously or a certain subset of signers have to sign a transaction in order to be valid.
        </Typography>
      </ToggleSection>
    </>
  )
}

function SettingsPage() {
  const isSmallScreen = useIsMobile()
  const router = useRouter()
  return (
    <>
      <Section top brandColored style={{ flexGrow: 0 }}>
        <Card
          style={{
            color: "white",
            position: "relative",
            background: "transparent",
            boxShadow: "none"
          }}
        >
          <CardContent style={{ paddingTop: 16, paddingBottom: 16 }}>
            <MainTitle
              onBack={() => router.history.push(routes.allAccounts())}
              style={{ margin: "-12px 0 -10px", minHeight: 56 }}
              title="Settings"
              titleColor="inherit"
            />
          </CardContent>
        </Card>
      </Section>
      <Section bottom style={{ display: "flex", paddingTop: 0, flexDirection: "column", overflowY: "auto" }}>
        <VerticalLayout height="100%" padding="0 8px" grow>
          <Box grow margin={isSmallScreen ? "0 -8px" : "24px 4px"} padding="0 8px" overflowY="auto">
            <Settings />
          </Box>
          <Box grow={0} margin="16px 0 0">
            <Typography align="center" color="textSecondary">
              v{pkg.version}
            </Typography>
          </Box>
        </VerticalLayout>
      </Section>
    </>
  )
}

export default SettingsPage
