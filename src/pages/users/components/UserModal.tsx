import React, { useEffect, FC } from 'react';
import { DatePicker, Form, Input, Modal, Switch } from 'antd';
import { SingleUserType, FormValues } from '../data.d';
import moment from "moment"

interface UserModalProps {
  visible: boolean;
  record: SingleUserType | undefined;
  closeHandler: () => void;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const UserModal: FC<UserModalProps> = (props: any) => {
  const [form] = Form.useForm()
  const { visible, record, closeHandler, onFinish, confirmLoading } = props


  useEffect(() => {
    if (record === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue(
        {
          ...record,
          create_time: moment(record.create_time),
          status: Boolean(record.status)
        }
      )
    }
  }, [visible])

  const onOk = () => {
    form.submit()
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);

  }


  return (
    <>
      <Modal
        title={record ? 'Edit ID:' + record.id : 'Add'}
        visible={visible}
        onOk={onOk}
        onCancel={closeHandler}
        forceRender
        confirmLoading={confirmLoading}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            status: true
          }}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Create Time"
            name="create_time"
          >
            <DatePicker showTime></DatePicker>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
          >
            <Switch></Switch>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default UserModal;