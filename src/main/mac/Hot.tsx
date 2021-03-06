import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import HotHistoryDialog from './HotHistoryDialog';
import { ColumnProps } from 'antd/lib/table';
import { IOpenTag } from '../../models';
import { App } from '../../store';

interface IProps {
  height: number;
  width: number;
  app: App;
}

interface IStates {
  pagination: { pageSize: number, current: number, total: number },
  data: any[];
  Dialog?: JSX.Element;
}

interface IData {
  key: string;
  id: string;
  internalSign: string;
  chineseName: string;
  signName: number;
  objectType: string;
}

@observer
export default class Hot extends  React.Component<IProps, IStates> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      pagination: { pageSize: 10, current: 1, total: 0 },
      data: [{ internalSign: 'E4-2D-7B-39-14-F1', chineseName: 'SL', signName: 30, objectType: '2019-08-12 17:28:00'  }],
      Dialog: undefined,
    };
  }

  closeDialog = () => {
    this.setState({ Dialog: undefined });
  };

  openDialog = (mac: string) => {
    const { width, height } = this.props;
    const Dialog = (
      <HotHistoryDialog { ...{ width, height, mac } } closeDialog={this.closeDialog} />
    );
    this.setState({ Dialog })
  };

  select = (value: string) => {
    const { app } = this.props;
    const { addTag } = app;
    let param: IOpenTag = { code: `hot#value`, text: '热点信息查询' };
    addTag(param);
  };

  showColumns = () => {
    const { pagination } = this.state;
    const { pageSize, current } = pagination;
    const startIndex = (current - 1) * pageSize + 1;
    const columns: ColumnProps<IData>[] = [
      {
        title: '序号',
        dataIndex: 'id',
        width: '10%',
        render: (text: string, record: IData, index: number) => startIndex + index,
      },
      {
        title: 'Mac地址',
        dataIndex: 'internalSign',
        sorter: true,
        width: '23%',
        render: (text:string) => {
          const value = text.replace(/[^0-9a-fA-F]/ig, '').toUpperCase();
          if (value.length === 12) {
            return <span
              className="link"
              onClick={() => this.select(text)}
            >{text}</span>
          }
          return text;
        }
      },
      {
        title: 'SSID',
        dataIndex: 'chineseName',
        sorter: true,
        width: '22%',
      },
      {
        title: '连接次数',
        dataIndex: 'signName',
        sorter: true,
        width: '22%',
        render: (text:number, record: IData) => {
          if (text > 0) {
            return (
              <span
                className="link"
                onClick={() => this.openDialog(record.internalSign)}
              >
              {text}
            </span>
            );
          }
          return text;
        }
      },
      {
        title: '最近一次连接时间',
        dataIndex: 'objectType',
        sorter: true,
        width: '23%',
      },
    ];
    return columns;
  };

  render() {
    const { height } = this.props;
    const { data, pagination, Dialog } = this.state;
    return (
      <div className="content" style={{ height }}>
        <Table
          columns={this.showColumns()}
          dataSource={data}
          pagination={pagination}
          size="small"
          bordered
          scroll={{ y: height - 100 }}
        />
        {Dialog}
      </div>
    )
  }
}

