import React from "react"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import Typography from "@material-ui/core/Typography"
import DoneAllIcon from "@material-ui/icons/DoneAll"
import CreditCardIcon from "@material-ui/icons/CreditCard"
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import UpdateIcon from "@material-ui/icons/Update"
import { Account } from "../../context/accounts"
import { SettingsContext } from "../../context/settings"
import { SignatureDelegationContext } from "../../context/signatureDelegation"
import { useHorizon } from "../../hooks/stellar"
import { useLiveRecentTransactions } from "../../hooks/stellar-subscriptions"
import { hasSigned } from "../../lib/transaction"
import { MinimumAccountBalance } from "../Fetchers"
import QRCodeIcon from "../Icon/QRCode"
import { VerticalLayout } from "../Layout/Box"
import FriendbotButton from "./FriendbotButton"
import OfferList from "./OfferList"
import { InteractiveSignatureRequestList } from "./SignatureRequestList"
import TransactionList from "./TransactionList"
import TransactionListPlaceholder from "./TransactionListPlaceholder"

function PendingMultisigTransactions(props: { account: Account }) {
  const { pendingSignatureRequests } = React.useContext(SignatureDelegationContext)

  const cosignIcon = React.useMemo(() => <DoneAllIcon />, [])
  const waitingIcon = React.useMemo(() => <UpdateIcon style={{ opacity: 0.5 }} />, [])

  const pendingRequestsToCosign = React.useMemo(() => {
    return pendingSignatureRequests.filter(
      request =>
        request._embedded.signers.some(signer => signer.account_id === props.account.publicKey) &&
        !hasSigned(request.meta.transaction, props.account.publicKey)
    )
  }, [props.account, pendingSignatureRequests])

  const pendingRequestsWaitingForOthers = React.useMemo(() => {
    return pendingSignatureRequests.filter(
      request =>
        request._embedded.signers.some(signer => signer.account_id === props.account.publicKey) &&
        hasSigned(request.meta.transaction, props.account.publicKey)
    )
  }, [props.account, pendingSignatureRequests])

  return (
    <>
      <InteractiveSignatureRequestList
        account={props.account}
        icon={cosignIcon}
        signatureRequests={pendingRequestsToCosign}
        title="Transactions to co-sign"
      />
      <InteractiveSignatureRequestList
        account={props.account}
        icon={waitingIcon}
        signatureRequests={pendingRequestsWaitingForOthers}
        title="Awaiting additional signatures"
      />
    </>
  )
}

function AccountTransactions(props: { account: Account }) {
  const { account } = props
  const horizon = useHorizon(account.testnet)
  const recentTxs = useLiveRecentTransactions(account.publicKey, account.testnet)
  const settings = React.useContext(SettingsContext)

  return (
    <List style={{ margin: "16px auto", maxWidth: 600 }}>
      <ListSubheader style={{ background: "none" }}>Funding options</ListSubheader>
      <ListItem button>
        <ListItemText
          primary="MoonPay"
          secondary="Buy Stellar Lumens instantly using your debit/credit card or Apple Pay"
        />
        <ListItemIcon style={{ minWidth: 40 }}>
          <OpenInNewIcon />
        </ListItemIcon>
      </ListItem>
    </List>
  )

  return (
    <>
      {recentTxs.loading ? (
        <TransactionListPlaceholder />
      ) : recentTxs.activated ? (
        <>
          {settings.multiSignature ? <PendingMultisigTransactions account={account} /> : null}
          <OfferList account={account} title="Open offers" />
          <TransactionList
            account={account}
            background="transparent"
            title="Recent transactions"
            testnet={account.testnet}
            transactions={recentTxs.transactions}
          />
        </>
      ) : (
        <>
          <Typography align="center" color="textSecondary" style={{ margin: "30px auto 0", padding: "0 16px" }}>
            Account does not yet exist on the network. Send at least <MinimumAccountBalance testnet={account.testnet} />
            &nbsp;XLM to activate the account.
          </Typography>
          <Divider style={{ margin: "30px 0" }} />
          <VerticalLayout alignItems="stretch" margin="0 auto" style={{ paddingBottom: 30, width: "fit-content" }}>
            {account.testnet ? <FriendbotButton horizon={horizon} publicKey={account.publicKey} /> : null}
            <Button startIcon={<CreditCardIcon />} style={{ background: "white", marginBottom: 16 }} variant="outlined">
              Fund your account
            </Button>
            <Button startIcon={<QRCodeIcon />} style={{ background: "white", marginBottom: 16 }} variant="outlined">
              Show public key
            </Button>
          </VerticalLayout>
        </>
      )}
    </>
  )
}

export default AccountTransactions
