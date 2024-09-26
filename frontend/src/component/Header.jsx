import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {Context} from '../App'
import { useContext } from "react"


function Header() {
  const [login, setLogin] = useContext(Context)
  const navigate = useNavigate()
  

  function handlesignup(){
    navigate('/signup')
  }

  function handleLogin(){
    navigate('/login')
  }
  function handleLogout(){
    localStorage.removeItem('user')
    setLogin(false)
    navigate('/login')
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
        <LinkContainer to='/'>
          <Navbar.Brand >Dashboard</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto">
            { login &&
                <LinkContainer to="/profile">
                  <Nav.Link >Profile</Nav.Link>
                  </LinkContainer>
            }
       
          </Nav>
          {
            !login? <>
            <Button onClick={handlesignup} varient="light" className='mx-3'>Sign up</Button>
            <Button onClick={handleLogin} varient="light">Login</Button>
            </>:  <Button  onClick={handleLogout} varient="light">Logout</Button>

          }
          
        </Container>
      </Navbar>
    </>
  );
}

export default Header;