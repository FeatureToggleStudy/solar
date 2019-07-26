import React from "react"
import { Transaction } from "stellar-sdk"
import Badge from "@material-ui/core/Badge"
import Typography from "@material-ui/core/Typography"
import lime from "@material-ui/core/colors/lime"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import { useIsMobile } from "../../hooks"
import { Box, VerticalLayout } from "../Layout/Box"
import { DialogActionsBox, ActionButton } from "./Generic"
import BitbondIcon from "../Icon/Bitbond"
import AccountSelectionList from "../Account/AccountSelectionList"
import { Account, AccountsContext } from "../../context/accounts"
import TransactionSender from "../TransactionSender"
import { Server } from "stellar-sdk"
import MainTitle from "../MainTitle"

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
            marginRight: -8,
            marginTop: 8,
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

export function PrefundingDialog(props: Props) {
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null)
  const isSmallScreen = useIsMobile()

  const logo = React.useMemo(
    () => (
      <TrustedBadge>
        <BitbondIcon style={{ color: "blue", height: 48, maxWidth: 150, width: "auto" }} />
      </TrustedBadge>
    ),
    []
  )

  const submit = async () => {
    if (!selectedAccount) {
      return
    }
    await props.sendTransaction(selectedAccount, props.transaction)
    await delay(2000)
    props.onClose()
  }

  return (
    <>
      <Box width="100%" maxWidth={900} padding={isSmallScreen ? "24px" : " 24px 32px"} margin="0 auto">
        <MainTitle actions={logo} hideBackButton onBack={() => undefined} title="Activate Account" />
        <Typography variant="body1" style={{ lineHeight: "150%", marginTop: 8, paddingRight: 96 }}>
          The website{" "}
          <Typography color="textSecondary" display="inline">
            bitbondsto.com
          </Typography>{" "}
          requests your public key.
          <br />
          In order to activate your account, you need to share your public key with Bitbond.
        </Typography>
        <VerticalLayout justifyContent="center" alignItems="stretch" margin="24px auto">
          <AccountSelectionList
            accounts={props.accounts}
            onChange={setSelectedAccount}
            showAccounts="unactivated"
            testnet={props.testnet}
            title="Select the account to activate"
            titleNone={`No unactivated ${props.testnet ? "testnet " : ""} accounts`}
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
            Activate account
          </ActionButton>
        </DialogActionsBox>
      </Box>
    </>
  )
}

function PrefundingDialogContainer(props: { testnet: boolean; transaction: Transaction; onClose: () => void }) {
  const accountsContext = React.useContext(AccountsContext)

  return (
    <TransactionSender testnet={props.testnet}>
      {txContext => <PrefundingDialog {...props} {...accountsContext} {...txContext} />}
    </TransactionSender>
  )
}

export default PrefundingDialogContainer
