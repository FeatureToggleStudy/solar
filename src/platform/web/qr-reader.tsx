import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"

const isFullscreenQRPreview = false

const ReactQRReader = React.lazy(() => import("react-qr-reader"))

const QRReader = React.memo(function QRReader(props: QrReader.props) {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <ReactQRReader {...props} />
    </React.Suspense>
  )
})

export { isFullscreenQRPreview, QRReader }
