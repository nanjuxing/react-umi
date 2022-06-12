import React, { useState, FC } from 'react'
import { Table, Space, Popconfirm, Button, Pagination } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { connect, Dispatch, Loading, UserState } from 'umi';
import UserModal from './components/UserModal';
import { SingleUserType, FormValues } from './data.d'

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  userListLoading: boolean
}

const UserListPage: FC<UserPageProps> = ({
  users, dispatch, userListLoading
}) => {

  const columns: ProColumns<SingleUserType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      valueType: 'text',
      key: 'name',
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (text: any, record: SingleUserType) => [
        <Space size="middle">
          <a onClick={() => { editHandler(record) }}>Edit</a>
          <Popconfirm
            title="是否确定删除"
            onConfirm={() => { confirm(record) }}
            okText="Yes"
            cancelText="No">
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ],
    },
  ];
  const [modelVisible, setModelVisible] = useState(false)
  const closeHandler = () => {
    setModelVisible(false)
  }
  const [record, setRecord] = useState<SingleUserType | undefined>(undefined)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const editHandler = (record: React.SetStateAction<SingleUserType | undefined>) => {
    setModelVisible(true)
    setRecord(record)
  }
  const onFinish = (values: FormValues) => {
    setConfirmLoading(true)
    values = {
      ...values,
      // create_time: moment(values.create_time),
      status: Number(values.status)
    }

    const id = record?.id;
    if (record) {
      dispatch({
        type: 'users/edit',
        payload: { values, id }
      })
    } else {
      dispatch({
        type: 'users/add',
        payload: { values }
      })
    }
    setConfirmLoading(false)
    setModelVisible(false)
  }
  const confirm = ({ id }: { id: any }) => {
    dispatch({
      type: 'users/delete',
      payload: { id }
    })
  }
  const addHandler = () => {
    setRecord(undefined)
    setModelVisible(true)
  }
  // const requestHandler = async ({ pageSize, current }) => {
  //   console.log(pageSize, current);

  //   const users = await getRemoteList({
  //     page: current,
  //     per_page: pageSize,
  //   })
  //   console.log(users);

  //   return {
  //     data: users?.data,
  //     success: true,
  //     total: users?.meta?.total,
  //   }
  // }
  const paginationHandler = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize
      }
    })

  }
  const pageSizeHandler = (current: number, size: number) => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        current,
        per_page: size
      }
    })
  }
  const resetHandler = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page
      }
    })
  }


  return (
    <div className="list-table">
      <ProTable
        columns={columns}
        rowKey='id'
        dataSource={users.data}
        loading={userListLoading}
        search={false}
        // request={requestHandler}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => {
            resetHandler()
          },
          setting: true
        }}
        headerTitle="User List"
        toolBarRender={() => [
          <Button type="primary" onClick={addHandler}>Add</Button>,
          <Button type="primary" onClick={resetHandler}>Reload</Button>
        ]}
      />
      <Pagination
        className="list-page"
        total={users?.meta?.total}
        onChange={paginationHandler}
        onShowSizeChange={pageSizeHandler}
        current={users?.meta?.page}
        pageSize={users?.meta?.per_page}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
      />
      <UserModal
        visible={modelVisible}
        closeHandler={closeHandler}
        record={record}
        onFinish={onFinish}
        confirmLoading={confirmLoading}
      ></UserModal>
      User
    </div>
  )
}

const mapStateToProps = ({ users, loading }: { users: UserState, loading: Loading }) => {
  console.log(users);

  return {
    users,
    userListLoading: loading.models.users,
  }
}

export default connect(mapStateToProps)(UserListPage)
