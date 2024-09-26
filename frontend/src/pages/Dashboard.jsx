import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import CreateApp from '../component/CreateApp'

const Dashboard = ({apps,loading,getApps}) => {
  const navigate = useNavigate()
  const[appList, setAppList] = useState([])
  const [searchVal, setSearchVal] = useState()
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleClose = () => setShow(false);
  const handleShow = (id = null) => {
    if (id) {
      setEditId(id);
    } else {
      setEditId(null);  
    }
    setShow(true); 
  };
  
  const handleDelete = async(appDelId)=>{
    const app = appList.find((app)=> app._id === appDelId)
    if(app.creator === user._id){

      const res = await fetch(`http://localhost:5000/apps/delete/${appDelId}`,{
        method:'DELETE',
    })
    const resData = await res.json()
    console.log(resData)
    const updatedAppList = appList.filter((app)=> app._id !== appDelId)
    setAppList(updatedAppList)
    getApps()
    }else{
      alert('You Cannot delete this app')
    }
  
  }

  useEffect(()=>{
    if(!user){
     navigate('/login')
     alert('Please Login')
    }
    if(apps){
      setAppList(apps)
    }
  },[apps])

  const handleChange = (e) => {
    if(e.target.value === ""){
      setAppList(apps); 
    }else{
      const filteredApp = appList.filter((app) =>
      app.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );  
    setAppList(filteredApp);
    }
  };

  return (
    <Container>
    <div className='mt-5'>   
    <Button variant="primary" onClick={() => handleShow()}  style={{marginLeft: '35rem'}}>
        Create App
      </Button>
      <Form>
      <Form.Group className="mb-3">
      <Form.Label>Find your Apps</Form.Label>
      <Form.Control type='text' value={searchVal} onChange={handleChange} placeholder="Find your Apps" />
      </Form.Group>
      </Form>
     
     
     
    { 
      loading ?  <>
      <Spinner animation="border" variant="dark" />
     
      </> :  appList.length === 0 ? <h1>No Apps Found</h1> :
        <>
      <h1 className='mt-5'>My Apps</h1>
      <div className='appList'>
     {   appList.map((app)=>(
      <Card style={{ width: '18rem',marginBottom: '10px' }} key={app._id}>
              <Card.Body>
              <Card.Title>{app.name}</Card.Title>
              <Card.Text> 
            {app.type}
            </Card.Text> 
            <Button variant="dark" onClick={()=>handleShow(app._id)} style={{marginRight: '10px'}}>Edit</Button>
            <Button variant="dark" onClick={()=>handleDelete(app._id)}>Delete</Button>
            </Card.Body>
            </Card>
        )) 
      }
      </div>


        </>
        
    }
<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateApp editId={editId} appList={appList} handleClose={handleClose} getApps={getApps}/>
        </Modal.Body>
      </Modal>
    </div>
    </Container>
  )
}

export default Dashboard