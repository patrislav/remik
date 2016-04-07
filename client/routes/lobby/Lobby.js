
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Lobby.scss';

function Lobby() {
  return (
    <div className={s.message}>Welcome to the lobby!</div>
  );
}

export default withStyles(Lobby, s);
