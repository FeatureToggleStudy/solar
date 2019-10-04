import React from "react"
import { Account } from "../../context/accounts"
import MainTitle from "../MainTitle"
import KeyExportBox from "../Account/KeyExportBox"
import DialogBody from "../Dialog/DialogBody"
import { Box } from "@material-ui/core"

interface Props {
  account: Account
  onClose: () => void
}

function ReceivePaymentDialog(props: Props) {
  return (
    <DialogBody top={<MainTitle onBack={props.onClose} title="Receive Funds" />}>
      <Box width="100%" margin="32px auto">
        <KeyExportBox export={props.account.publicKey} />
      </Box>
    </DialogBody>
  )
}

export default React.memo(ReceivePaymentDialog)
