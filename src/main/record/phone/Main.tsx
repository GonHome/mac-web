import React from 'react';
import { inject, observer } from 'mobx-react';
import * as _ from 'lodash';
import { DatePicker } from 'antd';
import { App, System } from '../../../store';
import { Row, Col, Table } from 'antd';
import { Intent, ButtonGroup, Button, Icon, Popover, Position } from '@blueprintjs/core';
import { IOpenTag } from '../../../models';
import MacInput from '../../MacInput';
import ColsFilter from '../ColsFilter';
const { RangePicker } = DatePicker;

interface IProps {
  system: System,
  app: App,
}

type stateTypes = {
  showBar: boolean;
  value: string;
}

const domType = 'phone';
const localKey = 'phone.main';

@inject('system', 'app')
@observer
export default class Main extends  React.Component<IProps, stateTypes> {

  constructor(props: IProps) {
    super(props);
    this.state = { showBar: false, value: '__-__-__-__-__'  };
  }

  componentDidMount(): void {
    const localValue = localStorage.getItem(localKey);
    if (localValue) {
      const state: stateTypes = _.cloneDeep(JSON.parse(localValue));
      this.setState(state);
    }
  }

  componentWillUnmount(): void {
    const { app } = this.props;
    const { tags } = app;
    const isExist = tags.some((tag: IOpenTag) => tag.code === domType);
    if (isExist) {
      localStorage.setItem(localKey,  JSON.stringify(this.state));
    } else {
      localStorage.setItem(localKey, '');
    }
  }

  macChange = (value: string) => {
    this.setState({ value });
  };

  render() {
    const { system } = this.props;
    const { showBar, value } = this.state;
    const { height } = system;
    return (
      <div className="right-body" style={{ height: height - 120 }}>
        <div className="head-bar" >
          <Row gutter={24}>
            <Col span={4}>
              终端MAC
            </Col>
            <Col span={10}>
              <MacInput value={value} onChange={this.macChange}/>
              <ButtonGroup>
                <Button text="查询" intent={Intent.PRIMARY} />
                <Button
                  icon={showBar ? "caret-up" : "caret-down"}
                  intent={Intent.PRIMARY}
                  onClick={() => this.setState({ showBar: !showBar })}
                />
              </ButtonGroup>
            </Col>
            <Col span={10}>
              <ButtonGroup className="right-button">
                <Button text="标记"  />
                <Button text="明细"  />
                <Button text="导出"  />
                <Popover position={Position.BOTTOM_RIGHT} content={<ColsFilter />}>
                  <Button text={<span>选择列<Icon icon="caret-down"/></span>} />
                </Popover>
              </ButtonGroup>
            </Col>
          </Row>
          <Row gutter={24} style={showBar ? { display: 'block' } : { display: 'none' } }>
            <Col span={4}>
              采集时间
            </Col>
            <Col span={10}>
              <RangePicker />
            </Col>
          </Row>
        </div>
        <div className="content">
          <Table />
        </div>
      </div>
    )
  }
}

