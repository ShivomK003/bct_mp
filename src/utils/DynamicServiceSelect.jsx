import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

const DynamicServiceSelect = ({ services=[], setServices }) => {
  const [service, setService] = useState({ title: "", description: "", price: "" });

  const handleAddService = () => {
    if (service.title && service.description && service.price) {
      setServices([...services, service]);
      setService({ title: "", description: "", price: "" }); // Reset the input fields
    }
  };

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
          placeholder="Service Price"
          type="number"
          value={service.price}
          onChange={(e) => setService({ ...service, price: e.target.value })}
          my={2}
        />
        <Button onClick={handleAddService} colorScheme="teal" mt={2}>
          Add Service
        </Button>
      </FormControl>
      {service.length > 0 && <p className="text-lg">Service {service.length} is added</p>}
    </div>
  );
};

export default DynamicServiceSelect;
