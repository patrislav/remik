
import React from 'react';
import Preload from './Preload';

import router from '../../routes';
import auth from '../../lib/auth';
import io from '../../socket';

export const action = 'preload';
export const controller = () => {
  auth.fbInit();
  auth.whenReady(() => {
    io.connect();
    router.change('lobby');
  });

  return <Preload></Preload>;
}
