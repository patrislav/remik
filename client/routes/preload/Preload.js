
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Preload.scss';

function Preload() {
  return (
    <div className={s.message}>Loading the game...</div>
  );
}

export default withStyles(Preload, s);
