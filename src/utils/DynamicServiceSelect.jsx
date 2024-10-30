import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { db } from "../firebaseConfig";
import { doc, addDoc, getDoc, collection } from "firebase/firestore";
import { useUser } from "./UserContext";

const DynamicServiceSelect = () => {
  const { user } = useUser();
  const [service, setService] = useState({ title: "", description: "", price: ""});
  const [alertMessage, setAlertMessage] = useState(null); 

  const handleAddService = async () => {
    if (!user || !user.id) {
      setAlertMessage({ status: 'error', title: "User Error: ", description: 'User not logged in or missing ID.' });
      return;
    }
    try {
      const profileDocRef = doc(db, "profiles", user.id)
      const serviceCollectionRef = collection(profileDocRef, "services")
      const serviceDocRef = await addDoc(serviceCollectionRef, service)
      
      setAlertMessage({ status: 'success', title: "Success: ", description: 'Login successful!' });
      console.log("Service Added to Database");
    } catch (error) {
      setAlertMessage({ status: 'error', title: "Error: ", description: error.message});
      console.error("Error", error);
    }
  }
  
  useEffect(() => {
    console.log(user);
  }, [user])  


  return (
    <div>
      <FormControl>
        <FormLabel>Add Service</FormLabel>
        <Input
          placeholder="Service Title"
          value={service.title}
          onChange={(e) => setService({ ...service, title: e.target.value })}
          my={2}
        />
        <Input
          placeholder="Service Description"
          value={service.description}
          onChange={(e) => setService({ ...service, description: e.target.value })}
          my={2}
        />
        <Input
          placeholder="Price/hr in your rupees"
          type="number"
          value={service.price}
          onChange={(e) => setService({ ...service, price: e.target.value })}
          my={2}
        />
        <Button onClick={handleAddService} colorScheme="teal" mt={2}>
          Add Service
        </Button>
      </FormControl>
      {alertMessage && (
        <Alert status={alertMessage.status} mb={4} textColor={"black"}>
            <AlertIcon />
            <AlertTitle>{alertMessage.title}</AlertTitle>
            <AlertDescription>{alertMessage.description}</AlertDescription>
        </Alert>
      )}
      {/* <pre>
        {service.title + " " + service.description + " " + service.price}
      </pre> */}
    </div>
  );
};

export default DynamicServiceSelect;
