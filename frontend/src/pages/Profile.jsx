import Container from "react-bootstrap/esm/Container"
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from "react-bootstrap/esm/Col"
import { useState,useContext } from "react"
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

const Profile = () => {
const user = JSON.parse(localStorage.getItem('user'))
const [oldPass,setOldPass]=useState('');
const [newPass,setNewPass]=useState('');
const [login, setLogin] = useContext(Context)
const navigate = useNavigate()

const handleOldPassChange = (e)=>{
    setOldPass(e.target.value)
  }
  const handleNewPassChange = (e)=>{
    setNewPass(e.target.value)
  }

  const handleResetSubmit = async(e)=>{
    e.preventDefault()
      try{
        const res = await fetch('http://localhost:5000/users/resetPassword',{
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify({
              newPassword:newPass,
              oldPassword:oldPass,
              userId: user._id,
          }),
          headers:{"Content-Type":'application/json'}            
      })
      const resData = await res.json()
      console.log(resData)
      if(res.ok){
        alert('Please login with your new password!')
        console.log('Password Changed')
        setLogin(false)
        navigate('/login')
      }else{
        alert('Something went wrong:', res);
      }

      }catch(err){
        console.log(err)
      }
     
  }

  return (
    <Container>
         <Row className="my-3">
            <Col>
            <p>Name</p>
            </Col>
            <Col>
            <h3>{user.name}</h3>
            </Col>
        </Row>
         <Row className="my-3">
            <Col>
            <p>Email</p>
            </Col>
            <Col>
            <h3>{user.email}</h3>
            </Col>
        </Row>
         <Row className="my-5" >
            <Col>
         <h2>Reset Password</h2>
            </Col>
        </Row>

<Form onSubmit={handleResetSubmit} className='my-5'>
<Form.Group className="mb-3">
<Form.Label>Old Password :</Form.Label>
<Form.Control type="oldpassword" value={oldPass} placeholder="Enter Old password"onChange={handleOldPassChange} />

</Form.Group>
<Form.Group className="mb-3">
<Form.Label>New Password :</Form.Label>
<Form.Control type="newpassword" value={newPass} placeholder="Enter New password"onChange={handleNewPassChange} />

</Form.Group>
<Button variant="primary" type='submit'>
        Reset Password
      </Button>
</Form>

    </Container>
  )
}

export default Profile