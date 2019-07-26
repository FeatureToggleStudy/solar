import React from "react"
import { Server, Transaction } from "stellar-sdk"
import Badge from "@material-ui/core/Badge"
import Typography from "@material-ui/core/Typography"
import lime from "@material-ui/core/colors/lime"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import { useIsMobile } from "../../hooks"
import { Box, VerticalLayout } from "../Layout/Box"
import StellarGuardIcon from "../Icon/StellarGuard"
import AccountSelectionList from "../Account/AccountSelectionList"
import { Account, AccountsContext } from "../../context/accounts"
import { loadAccount } from "../../lib/account"
import { NullPublicKey } from "../../lib/stellar"
import { createCopyWithDifferentSourceAccount } from "../../lib/transaction"
import TransactionSender from "../TransactionSender"
import MainTitle from "../MainTitle"
import { DialogActionsBox, ActionButton } from "./Generic"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
            marginRight: -4,
            marginTop: 4,
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

  const logo = React.useMemo(
    () => (
      <TrustedBadge>
        <StellarGuardIcon style={{ color: "blue", height: 48, maxWidth: 150, width: "auto" }} />
      </TrustedBadge>
    ),
    []
  )

  const submit = async () => {
    let transaction = props.transaction
    if (!selectedAccount) {
      return
    }
    if (transaction.source === NullPublicKey) {
      // We probably received this transaction via a SEP-7 URI and need to fill-in the source
      const accountData = await loadAccount(props.horizon, selectedAccount.publicKey)
      if (accountData) {
        transaction = createCopyWithDifferentSourceAccount(transaction, accountData)
      }
    }
    await props.sendTransaction(selectedAccount, transaction)
    await delay(2000)
    props.onClose()
  }

  return (
    <>
      <Box width="100%" maxWidth={900} padding={isSmallScreen ? "24px" : " 24px 32px"} margin="0 auto">
        <MainTitle actions={logo} hideBackButton onBack={() => undefined} title="Enable Two-Factor Authentication" />
        <Typography variant="body1" style={{ marginTop: 8, paddingRight: 96 }}>
          To add two-factor authentication to your account you need to add StellarGuard as a co-signer to your account.
        </Typography>
        <VerticalLayout justifyContent="center" alignItems="stretch" margin="24px auto">
          <AccountSelectionList
            accounts={props.accounts}
            onChange={setSelectedAccount}
            showAccounts="activated"
            testnet={props.testnet}
            title="Select the account to protect"
            titleNone="No activated testnet accounts"
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
