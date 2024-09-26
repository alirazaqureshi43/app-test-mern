import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

const CreateApp = ({ editId, appList,handleClose,getApps }) => {
  const [name, setName] = useState();
  const [subscriptionDate, setSubscriptionDate] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [type, setType] = useState();
  const [subscriptionAmount, setSubscriptionAmount] = useState();
  const[editState, setEditState]=useState(false)
  const user = JSON.parse(localStorage.getItem("user"));

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleTypeChange(e) {
    setType(e.target.value);
  }
  function handleExpiryChange(e) {
    setExpiryDate(e.target.value);
  }
  function handleSubcriptionChange(e) {
    setSubscriptionDate(e.target.value);
  }
  function handleSubscriptionAmountChange(e) {
    setSubscriptionAmount(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior
    console.log("submiting");
    const payload = {
      name: name,
      subscriptionDate: subscriptionDate,
      expiryDate: expiryDate,
      type: type,
      subscriptionAmount: subscriptionAmount,
      creator: user._id,
    };
    console.log(payload);

    try {
      if (editState) {
        console.log("Editing...");
        const editRes = await fetch(
          `http://localhost:5000/apps/edit/${editId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const editResData = await editRes.json();
        if(editRes.ok){
          alert('App Edited')
          handleClose()
          console.log(editResData);
          setName("");
          setExpiryDate("");
          setType("");
          setSubscriptionAmount("");
          setSubscriptionDate("");
          getApps()
        }else{
          alert('Something went wrong')
        }
      } else {
        const createRes = await fetch("http://localhost:5000/apps", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const createResData = await createRes.json();
        if(createRes.ok){
          alert('App created')
          handleClose()
          console.log(createResData);
          setName("");
          setExpiryDate("");
          setType("");
          setSubscriptionAmount("");
          setSubscriptionDate("");
          getApps()
        }else{
          alert('Something went wrong')
        }
       
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log(editId)
    if (editId) {
      
      var app = appList.find((app) => app._id === editId);
    }

    if (app) {
      setName(app.name);
      setExpiryDate(app.expiryDate);
      setSubscriptionAmount(app.subscriptionAmount);
      setSubscriptionDate(app.subscriptionDate);
      setType(app.type);
    }

    if (editId) {
      setEditState(true);
    }

    console.log(editId);
  }, [editId]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter app name"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <label htmlFor="type">Type</label>
          <Form.Control
            type="text"
            value={type}
            onChange={handleTypeChange}
            placeholder="Enter Type"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="subscriptionAmount">
            Subcription Amount
          </Form.Label>
          <Form.Control
            type="number"
            value={subscriptionAmount}
            onChange={handleSubscriptionAmountChange}
            placeholder="Enter Amount"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="expiryDate">Expiry Date</Form.Label>
          <Form.Control
            type="date"
            value={expiryDate}
            onChange={handleExpiryChange}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label htmlFor="subscriptionDate">Subcription Date</Form.Label>
          <Form.Control
            type="date"
            value={subscriptionDate}
            onChange={handleSubcriptionChange}
          />
        </Form.Group>
        <Button className="mt-3" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CreateApp;
