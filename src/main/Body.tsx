import React from 'react';
import { inject, observer } from 'mobx-react';
import { System, App } from '../store';
import InJect from '../util/InJect';
import { menuDom } from '../constants/app';

interface IProps {
  system: System,
  app: App,
}
@inject('system', 'app')
@observer
export default class Body extends  React.Component<IProps> {
  render() {
    const { system, app } = this.props;
    const { height } = system;
    const { checkedTag } = app;
    return (
      <div className="body" style={{ height: height - 100 }}>
        {menuDom[checkedTag] ? <InJect Component={menuDom[checkedTag]}/> : null}
      </div>
    )
  }
}

