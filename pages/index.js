import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  InputNumber,
  Upload,
  Spin,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";

function Home() {
  const [photograph, setPhoto] = useState([]);
  const [form] = Form.useForm();
  const [loading, setIsLoading] = useState(false);

  const storeFile = ({ fileList }) => {
    setPhoto(fileList);
  };

  const response = (msg, type) => {
    if (type == "error") {
      return message.error(msg);
    }
    if (type == "success") {
      return message.success(msg);
    }
  };

  const props = {
    multiple: false,
    beforeUpload: () => false,
  };

  const onFinish = async (values) => {
    let age = moment().diff(moment(values.dateOfBirth, "YYYYMMDD"), "years");

    if (parseInt(age) < 18) {
      response(
        "Your date of birth shows that your age is below 18, Pls age should be 18 and above",
        "error"
      );
      return;
    }

    if (parseInt(age) > 65) {
      response(
        "Your date of birth shows that your age is above 65. Pls age should be within the range of 18 - 65 years",
        "error"
      );
      return;
    }

    setIsLoading(true);

    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("age", age);
    formData.append("dateOfBirth", values.dateOfBirth);
    formData.append("family", JSON.stringify(values.family));
    formData.append("photograph", photograph[0].originFileObj);

    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.open("POST", "http://172.104.205.11/user/create");
    ajax.send(formData);

    function completeHandler(event) {
      form.resetFields();
      setIsLoading(false);
      response("Data uploaded successfully.", "success");
    }

    function errorHandler(event) {
      setIsLoading(false);
      response("An error occured. pls try again", "error");
    }
  };
  return (
    <Spin spinning={loading}>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 center m-auto shadow p-4">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ family: [""] }}
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Pls enter your fullname" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Pls enter a valid email address",
                    type: "email",
                  },
                ]}
              >
                <Input placeholder="test@example.com" />
              </Form.Item>
              <Space style={{ display: "flex" }} align="start">
                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Pls Select your date of birth",
                    },
                  ]}
                >
                  <DatePicker
                    disabledDate={(d) => !d || d.isAfter(moment())}
                    initialValue={moment()}
                    format={"YYYY-MM-DD"}
                  />
                </Form.Item>
              </Space>
              <Form.Item
                name="photograph"
                label="Photograph"
                rules={[{ required: true, message: "Pls Upload a Photograph" }]}
              >
                <Upload accept="image/*" onChange={storeFile} {...props}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>

              <Form.List name="family">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      <p>Enter family member's details</p>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="start"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
                            rules={[
                              { required: true, message: "Missing name" },
                            ]}
                          >
                            <Input placeholder="Full Name" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "relationship"]}
                            fieldKey={[field.fieldKey, "relationship"]}
                            rules={[
                              { required: true, message: "Relationship" },
                            ]}
                          >
                            <Input placeholder="Relationship" />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, "age"]}
                            fieldKey={[field.fieldKey, "age"]}
                            rules={[{ required: true, message: "Missing age" }]}
                          >
                            <InputNumber placeholder="Age" />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add family member
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default Home;
