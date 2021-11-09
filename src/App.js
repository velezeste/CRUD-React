import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, Select, Row, Col, Divider, Avatar, Space } from "antd";
import { UserOutlined, BarcodeOutlined, DollarOutlined, RestOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "./App.css";
import axios from "axios";

let sele;

const { Option } = Select;
const { Item } = Form;

const baseUrl = "http://localhost:3001/productos";

const layout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 24
  }
};

function App() {

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [producto, setProducto] = useState({
    id: '',
    nombre: '',
    categoria: '',
    sabor: '',
    precio: '',
    estado: true
  })

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });
    console.log(producto);
  }

  const handleChangeSelect = value => {
    setProducto({
      ...producto,
      ["estado"]: value
    });
    console.log(`selected ${value}`);
    console.log(producto);
  }

  const ChangeSelectCat = value => {
    setProducto({
      ...producto,
      ["categoria"]: value
    });
    console.log(`selected ${value}`);
    console.log(producto);
  }

  const onChange = async (value) => {
    sele = value;
    if (sele == "todas") {
      await axios.get(baseUrl)
        .then(response => {
          setData(response.data);
        }).catch(error => {
          console.log(error);
        })
    }
    else {
      await axios.get(baseUrl, {
        params: {
          categoria: sele
        }
      })
        .then(response => {
          setData(response.data);
        }).catch(error => {
          console.log(error);
        })
    }
  };

  const seleccionarProducto = (producto, caso) => {
    setProducto(producto);
    (caso === "Editar") ? abrirCerrarModalEditar() : abrirCerrarModalEliminar()
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Producto",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
    },
    {
      title: "Sabor",
      dataIndex: "sabor",
      key: "sabor",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (text, record) => (
        <Space size="middle">
        <p>{record.estado.toString()}</p>        
      </Space>        
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (fila) => (
        <>
          <Button type="primary" onClick={() => seleccionarProducto(fila, "Editar")}>Editar</Button> {"   "}
          <Button type="primary" danger onClick={() => seleccionarProducto(fila, "Eliminar")}>Eliminar</Button>
        </>
      ),
    },
  ];

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    delete producto.id;
    await axios.post(baseUrl, producto)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    await axios.put(baseUrl + "/" + producto.id, producto)
      .then(response => {
        var dataAuxiliar = data;
        dataAuxiliar.map(elemento => {
          if (elemento.id === producto.id) {
            elemento.nombre = producto.nombre;
            elemento.categoria = producto.categoria;
            elemento.sabor = producto.sabor;
            elemento.precio = producto.precio;
            elemento.estado = producto.estado;
          }
        });
        setData(dataAuxiliar);
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + "/" + producto.id)
      .then(response => {
        setData(data.filter(elemento => elemento.id !== producto.id));
        abrirCerrarModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div className="App">
      <br />
      <br />
      <Row>
        <Col span={6}><Avatar icon={<UserOutlined />} /> Estevan Velez Sepulveda</Col>
        <Col span={6}></Col>
        <Col span={6}><Button type="primary" className="botonInsertar" onClick={abrirCerrarModalInsertar}>Insertar Nuevo Producto</Button></Col>
        <Col span={6}><Item>
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Seleccione una categoria"
            optionFilterProp="children"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="todas">Todas las categorias</Option>
            <Option value="fritos">Fritos</Option>
            <Option value="galletas">Galletas</Option>
            <Option value="pastel">Pastel</Option>
          </Select>
        </Item></Col>
      </Row>
      <Divider orientation="left">Base de Datos Json</Divider>
      <Row justify="space-around">
        <Col span={2}></Col>
        <Col span={20}><Table columns={columns} dataSource={data} /></Col>
        <Col span={2}></Col>
      </Row>


      <Modal
        visible={modalInsertar}
        title="Insertar Producto"
        destroyOnClose={true}
        onCancel={abrirCerrarModalInsertar}
        centered
        footer={[
          
        ]}>
        <Form {...layout} form={form}>                       
          <Form.Item name="nombre" rules={[{ required: true, message: 'Por favor, ingresa el nombre del producto!',},]}>
            <Input name="nombre" onChange={handleChange} allowClear  prefix={<BarcodeOutlined className="site-form-item-icon" />} placeholder="Nombre Producto" />
          </Form.Item>
          <Form.Item name="categoria" rules={[{ required: true, message: 'Por favor, ingresa la categoria!',},]}>
            <Select name="categoria" placeholder="Categoria" onChange={ChangeSelectCat} allowClear>
              <Option value="fritos">Fritos</Option>
              <Option value="galletas">Galletas</Option>
              <Option value="pastel">Pastel</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sabor" rules={[{ required: true, message: 'Por favor, ingresa el sabor!',},]}>
            <Input name="sabor" onChange={handleChange} allowClear prefix={<RestOutlined className="site-form-item-icon" />} placeholder="Sabor" />
          </Form.Item>
          <Form.Item name="precio"  rules={[{ required: true, message: 'Por favor, ingresa el precio!',},]}>
            <Input name="precio" onChange={handleChange} allowClear prefix={<DollarOutlined className="site-form-item-icon" />} placeholder="Precio" />
          </Form.Item>          
          <center>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                onClick={peticionPost}
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                Registrar
              </Button>
            )}
          </Form.Item>
          <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>
          <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}>Clear</Button>
          </center>
        </Form>        
      </Modal>

      <Modal
        visible={modalEditar}
        title="Editar Producto"
        onCancel={abrirCerrarModalEditar}
        centered
        footer={[
          <Button onClick={abrirCerrarModalEditar}>Cancelar</Button>,
          <Button type="primary" onClick={peticionPut}>Editar</Button>,
        ]}
      >
        <Form {...layout} form={form}>
        <Form.Item rules={[{ required: true, message: 'Por favor, ingresa el nombre del producto!',},]}>
            <Input name="nombre" value={producto && producto.nombre} onChange={handleChange} allowClear prefix={<BarcodeOutlined className="site-form-item-icon" />} placeholder="Nombre Producto" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: 'Por favor, ingresa la categoria!',},]}>
            <Select name="categoria" placeholder="Categoria" onChange={ChangeSelectCat} value={producto && producto.categoria} allowClear>
              <Option value="fritos">Fritos</Option>
              <Option value="galletas">Galletas</Option>
              <Option value="pastel">Pastel</Option>
            </Select>
          </Form.Item>
          <Form.Item rules={[{ required: true, message: 'Por favor, ingresa el sabor!',},]}>
            <Input name="sabor" value={producto && producto.sabor} onChange={handleChange} allowClear prefix={<RestOutlined className="site-form-item-icon" />} placeholder="Sabor" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: 'Por favor, ingresa el precio!',},]}>
            <Input name="precio" value={producto && producto.precio} onChange={handleChange} allowClear prefix={<DollarOutlined className="site-form-item-icon" />} placeholder="Precio" />
          </Form.Item> 
          <Form.Item rules={[{ required: true, message: 'Por favor, ingresa el estado!',},]}>
            <Select name="estado" placeholder="Estado" onChange={handleChangeSelect} value={producto && producto.estado} allowClear>
              <Option value={true}>True</Option>
              <Option value={false}>False</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={modalEliminar}
        onCancel={abrirCerrarModalEliminar}
        centered
        footer={[
          <Button onClick={abrirCerrarModalEliminar}>No</Button>,
          <Button type="primary" danger onClick={peticionDelete}>Sí</Button>,
        ]}
      >
        Estás seguro que deseas eliminar al producto <b>{producto && producto.nombre}</b>?
      </Modal>
    </div>
  );
}

export default App;