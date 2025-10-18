import { IOClient } from '@/services/ioClient'
import React from 'react'

const useIOClient = () => {
  const ioClient = React.useMemo(() => IOClient.getInstance(), [])

  return ioClient
}

export default useIOClient