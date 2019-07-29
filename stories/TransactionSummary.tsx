import React from "react"
import Async from "react-promise"
import { Asset, Memo, Network, Operation, Server, Transaction, TransactionBuilder } from "stellar-sdk"
import { storiesOf } from "@storybook/react"
import TransactionSummary from "../src/components/TransactionReview/TransactionSummary"
import { Account } from "../src/context/accounts"
import { useWebAuth, useSigningKeyDomainCache } from "../src/hooks"

const testAccount = {
  id: "testid1",
  name: "My Testnet Account #1",
  publicKey: "GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W",
  requiresPassword: false,
  testnet: true,
  getPrivateKey: (password: string) => Promise.resolve(password)
}

interface SampleWebAuthProps {
  accountID: string
  children: (promise: Promise<any>) => React.ReactNode
  issuerID: string
}

function SampleWebAuth(props: SampleWebAuthProps) {
  Network.usePublicNetwork()
  const horizon = new Server("https://horizon.stellar.org")
  const WebAuth = useWebAuth()

  const promise = React.useMemo(
    () =>
      (async () => {
        const account = await horizon.loadAccount(props.accountID)
        const webauthMetadata = await WebAuth.fetchWebAuthData(horizon, props.issuerID)

        const transaction = await WebAuth.fetchChallenge(
          webauthMetadata!.endpointURL,
          webauthMetadata!.signingKey,
          account.id
        )
        return transaction
      })(),
    []
  )

  return <>{props.children(promise)}</>
}

interface StellarUriWebAuthProps {
  account: Account | null
  domain: string
  transaction: Transaction
}

function StellarUriWebAuth(props: StellarUriWebAuthProps) {
  const signingKeyCache = useSigningKeyDomainCache()
  if (!signingKeyCache.has(props.transaction.source)) {
    signingKeyCache.set(props.transaction.source, props.domain)
  }
  return <TransactionSummary account={props.account} testnet transaction={props.transaction} />
}

storiesOf("TransactionSummary", module)
  .add("Payment", () => {
    Network.useTestNetwork()
    const horizon = new Server("https://horizon-testnet.stellar.org")

    const promise = (async () => {
      const account = await horizon.loadAccount("GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W")
      const builder = new TransactionBuilder(account, { fee: 100 })
      builder.addOperation(
        Operation.payment({
          amount: "1.5",
          asset: Asset.native(),
          destination: "GA2CZKBI2C55WHALSTNPG54FOQCLC6Y4EIATZEIJOXWQPSEGN4CWAXFT"
        })
      )
      builder.setTimeout(60)
      return builder.build()
    })()

    return (
      <Async
        promise={promise}
        then={transaction => <TransactionSummary account={null} testnet transaction={transaction} />}
        catch={error => <>{error.message}</>}
      />
    )
  })
  .add("Payment with memo", () => {
    Network.useTestNetwork()
    const horizon = new Server("https://horizon-testnet.stellar.org")

    const promise = (async () => {
      const account = await horizon.loadAccount("GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W")
      const builder = new TransactionBuilder(account, {
        fee: 100,
        memo: Memo.text("Demo transaction")
      })
      builder.addOperation(
        Operation.payment({
          amount: "20",
          asset: Asset.native(),
          destination: "GA2CZKBI2C55WHALSTNPG54FOQCLC6Y4EIATZEIJOXWQPSEGN4CWAXFT"
        })
      )
      builder.setTimeout(60)
      return builder.build()
    })()

    return (
      <Async
        promise={promise}
        then={transaction => <TransactionSummary account={null} testnet transaction={transaction} />}
        catch={error => <>{error.message}</>}
      />
    )
  })
  .add("Account creation & Inflation destination", () => {
    Network.useTestNetwork()
    const horizon = new Server("https://horizon-testnet.stellar.org")

    const promise = (async () => {
      const account = await horizon.loadAccount("GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W")
      const builder = new TransactionBuilder(account, { fee: 100 })
      builder.addOperation(
        Operation.createAccount({
          startingBalance: "1.0",
          destination: "GA2CZKBI2C55WHALSTNPG54FOQCLC6Y4EIATZEIJOXWQPSEGN4CWAXFT"
        })
      )
      builder.addOperation(
        Operation.setOptions({
          inflationDest: "GCCD6AJOYZCUAQLX32ZJF2MKFFAUJ53PVCFQI3RHWKL3V47QYE2BNAUT"
        })
      )
      builder.setTimeout(60)
      return builder.build()
    })()

    return (
      <Async
        promise={promise}
        then={transaction => <TransactionSummary account={null} testnet transaction={transaction} />}
        catch={error => <>{error.message}</>}
      />
    )
  })
  .add("Stellar web auth", () => {
    return (
      <SampleWebAuth
        accountID="GDOOMATUOJPLIQMQ4WWXBEWR5UMKJW65CFKJJW3LV7XZYIEQHZPDQCBI"
        issuerID="GBVOL67TMUQBGL4TZYNMY3ZQ5WGQYFPFD5VJRWXR72VA33VFNL225PL5"
      >
        {promise => (
          <Async
            promise={promise}
            then={transaction => <TransactionSummary account={null} testnet transaction={transaction} />}
            catch={error => <>{error.message}</>}
          />
        )}
      </SampleWebAuth>
    )
  })
  .add("Bitbond Stellar URI web auth", () => {
    const transaction = new Transaction(
      "AAAAAInBVdpcjRBmja162KpaBLPkf3nFH78G/pDmsTbGj/JWAAAAZAAAAAAAAAAAAAAAAQAAAABdPvnqAAAAAF0++esAAAAAAAAAAQAAAAEAAAAAXhLaoQDkSRgDsQwvyNM5N930tlcDL1Lbsw99eecyD9YAAAAKAAAAGHRlc3QuYml0Ym9uZHN0by5jb20gYXV0aAAAAAEAAABA5BcgWPIxtIxtE+CaGhI64nyTMU733BY1ek/B0Xc4F6A+1stpw6xvx807R9TXNcDKZuhL4ayWWoqLUNPKTAH1HgAAAAAAAAABxo/yVgAAAEAGSqeBHbwoD9UxCbHLz0PQZEMa52sJHxPXe4xg3mONHHNQ97Yvu1aapCjvUBV9Wu7lZOVrwFczaVgClkqKE4YK"
    )
    return <StellarUriWebAuth account={testAccount} domain="bitbondsto.com" transaction={transaction} />
  })
  .add("Account Merge", () => {
    Network.useTestNetwork()
    const horizon = new Server("https://horizon-testnet.stellar.org")

    const promise = (async () => {
      const account = await horizon.loadAccount("GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W")
      const builder = new TransactionBuilder(account, { fee: 100 })
      builder.addOperation(
        Operation.accountMerge({
          source: "GCCD6AJOYZCUAQLX32ZJF2MKFFAUJ53PVCFQI3RHWKL3V47QYE2BNAUT",
          destination: "GA2CZKBI2C55WHALSTNPG54FOQCLC6Y4EIATZEIJOXWQPSEGN4CWAXFT"
        })
      )
      builder.setTimeout(60)
      return builder.build()
    })()

    return (
      <Async
        promise={promise}
        then={transaction => <TransactionSummary account={null} testnet transaction={transaction} />}
        catch={error => <>{error.message}</>}
      />
    )
  })
