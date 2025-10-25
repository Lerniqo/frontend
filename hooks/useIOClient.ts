import { IOClient } from '@/services/ioClient'
import userService from '@/services/userService';
import React, { useEffect } from 'react'

const useIOClient = () => {
  const instance = IOClient.getInstance();
  return instance;
}

export default useIOClient;