import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Zoom from "@material-ui/core/Zoom"
import { storiesOf } from "@storybook/react"
import { PrefundingDialog } from "../src/components/Dialog/Prefunding"
import { StellarGuardActivationDialog } from "../src/components/Dialog/StellarGuardActivation"
import { Transaction } from "stellar-base"
import { parseStellarUri, TransactionStellarUri } from "@stellarguard/stellar-uri"
import { Server } from "stellar-sdk"

const DialogTransition = (props: any) => <Zoom {...props} />

const accounts = [
  {
    id: "1",
    name: "My Testnet Account #1",
    publicKey: "GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W",
    requiresPassword: false,
    testnet: true,
    getPrivateKey: () => Promise.resolve("")
  },
  {
    id: "2",
    name: "My Testnet Account #2",
    publicKey: "GDNVDG37WMKPEIXSJRBAQAVPO5WGOPKZRZZBPLWXULSX6NQNLNQP6CFF",
    requiresPassword: false,
    testnet: true,
    getPrivateKey: () => Promise.resolve("")
  },
  {
    id: "3",
    name: "My New Testnet Account",
    publicKey: "GBLMOLIHYMTJMT2P3ZYF5LCBYCF6BODWGCBRCXRYQ77EZFDI2ZADERHA",
    requiresPassword: false,
    testnet: true,
    getPrivateKey: () => Promise.resolve("")
  }
]

const horizon = new Server("https://horizon-testnet.stellar.org")

storiesOf("Stellar URI Dialogs", module)
  .add("Bitbond Activation Dialog", () => {
    const uri = parseStellarUri(
      "web+stellar:tx?xdr=AAAAAInBVdpcjRBmja162KpaBLPkf3nFH78G%2FpDmsTbGj%2FJWAAAAZAAAAAAAAAAAAAAAAQAAAABdOyNQAAAAAF07I1EAAAAAAAAAAQAAAAAAAAAKAAAAGHRlc3QuYml0Ym9uZHN0by5jb20gYXV0aAAAAAEAAABA5BcgWPIxtIxtE%2BCaGhI64nyTMU733BY1ek%2FB0Xc4F6A%2B1stpw6xvx807R9TXNcDKZuhL4ayWWoqLUNPKTAH1HgAAAAAAAAABxo%2FyVgAAAEDilHozjLam63beGuw1OTPiFeqAV16FyuXL%2FM2%2BrD58yU3SZoGoK0ikzyhqVYGA%2Fc%2BS2HzXl7Ql34ZMq%2BAHlQwD&origin_domain=test.bitbondsto.com&callback=https%3A%2F%2Ftest.bitbondsto.com%2Fstellar%2Fprefund&purpose=activation&network_passphrase=Test+SDF+Network+%3B+September+2015"
    )
    const transaction = new Transaction((uri as TransactionStellarUri).xdr)

    return (
      <Dialog open={true} fullScreen onClose={undefined} TransitionComponent={DialogTransition}>
        <PrefundingDialog
          sendTransaction={() => undefined}
          accounts={accounts}
          testnet={true}
          transaction={transaction}
          onClose={() => undefined}
          horizon={horizon}
        />
      </Dialog>
    )
  })
  .add("StellarGuard Activation Dialog", () => {
    const uri = parseStellarUri(
      "web+stellar:tx?xdr=AAAAADPMT6JWh08TPGnc5nd6eUtw0CfJA4kQjkHZzGEQqGWHAAAAZAAGXSAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAM8xPolaHTxM8adzmd3p5S3DQJ8kDiRCOQdnMYRCoZYcAAAAAAAAAAACYloAAAAAAAAAAAA%3D%3D&msg=order+number+123&callback=url%3Ahttps%3A%2F%2Fexample.com%2Fstellar&origin_domain=test.stellarguard.me&signature=TwoRggPieF6UorVeLHSYZhRRKv8mMwezVUiirms%2F8N6oe8EZOCYKSsNWAn2o1rVb8jhEVte%2FEFZcRkzyXEZdBw%3D%3D"
    )
    const transaction = new Transaction((uri as TransactionStellarUri).xdr)

    return (
      <Dialog open={true} fullScreen onClose={undefined} TransitionComponent={DialogTransition}>
        <StellarGuardActivationDialog
          sendTransaction={() => undefined}
          accounts={accounts}
          testnet={true}
          transaction={transaction}
          onClose={() => undefined}
          horizon={horizon}
        />
      </Dialog>
    )
  })
