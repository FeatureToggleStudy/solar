import React from "react"
import Badge from "@material-ui/core/Badge"
import Typography from "@material-ui/core/Typography"
import lime from "@material-ui/core/colors/lime"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import { useIsMobile } from "../../hooks"
import { Box, VerticalLayout } from "../Layout/Box"
import { DialogActionsBox, ActionButton } from "./Generic"
import StellarGuardIcon from "../Icon/StellarGuard"
import { Transaction } from "stellar-base"
import AccountSelectionList from "../Account/AccountSelectionList"
import { Account, AccountsContext } from "../../context/accounts"
import TransactionSender from "../TransactionSender"
import { loadAccount } from "../../lib/account"
import { Server } from "stellar-sdk"
import { createCopyWithDifferentSourceAccount } from "../../lib/transaction"
import MainTitle from "../MainTitle"

function TrustedBadge(props: { children: React.ReactNode }) {
  return (
    <Badge
      badgeContent={
        <CheckIcon
          style={{
            background: lime[500],
            borderRadius: "50%",
            color: "white",
            fontSize: "150%",
            padding: "0.1em"
          }}
        />
      }
    >
      {props.children}
    </Badge>
  )
}

interface Props {
  onClose: () => void
  transaction: Transaction
  testnet: boolean
  accounts: Account[]
  horizon: Server
  sendTransaction: (account: Account, transaction: Transaction) => void
}

export function StellarGuardActivationDialog(props: Props) {
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null)
  const isSmallScreen = useIsMobile()

  const submit = async () => {
    if (!selectedAccount) {
      return
    }
    const stellarAccount = await loadAccount(props.horizon, selectedAccount.publicKey)
    if (stellarAccount) {
      const modifiedTransaction = createCopyWithDifferentSourceAccount(props.transaction, stellarAccount)
      await props.sendTransaction(selectedAccount, modifiedTransaction)
      setTimeout(props.onClose, 2000)
    }
  }

  const filteredAccounts = React.useMemo(
    () => {
      return props.accounts.filter(account => account.testnet === props.testnet)
    },
    [props.accounts, props.testnet]
  )

  const logo = React.useMemo(
    () => (
      <TrustedBadge>
        <StellarGuardIcon style={{ color: "blue", fontSize: "400%" }} />
      </TrustedBadge>
    ),
    []
  )

  return (
    <>
      <Box width="100%" maxWidth={900} padding={isSmallScreen ? "24px" : " 24px 32px"} margin="0 auto 32px">
        <MainTitle actions={logo} hideBackButton onBack={() => undefined} title="Enable Two-Factor Authentication" />
        <Typography variant="body1" style={{ marginTop: 8, paddingRight: 96 }}>
          To add two-factor authentication to your account you need to add StellarGuard as a co-signer to your account.
        </Typography>
        <VerticalLayout justifyContent="center" alignItems="stretch" margin="48px auto">
          <AccountSelectionList
            accounts={filteredAccounts}
            onChange={setSelectedAccount}
            testnet={props.testnet}
            title="Select the account to protect"
          />
        </VerticalLayout>
        <DialogActionsBox>
          <ActionButton icon={<CloseIcon />} onClick={props.onClose}>
            Cancel
          </ActionButton>
          <ActionButton
            autoFocus
            disabled={selectedAccount === null}
            icon={<CheckIcon />}
            onClick={submit}
            type="primary"
          >
            Enable StellarGuard
          </ActionButton>
        </DialogActionsBox>
      </Box>
    </>
  )
}

function StellarGuardActivationContainer(props: { testnet: boolean; transaction: Transaction; onClose: () => void }) {
  const accountsContext = React.useContext(AccountsContext)

  return (
    <TransactionSender testnet={props.testnet}>
      {txContext => <StellarGuardActivationDialog {...props} {...accountsContext} {...txContext} />}
    </TransactionSender>
  )
}

export default StellarGuardActivationContainer