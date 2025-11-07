import databaseService from '@/services/database.services';
import React from 'react'

function AllServices() {
    const [services, setServices] = React.useState([])
    const fetchServices = async () => {
        try {
            const response = await databaseService.getAllServices();
            console.log("Fetched services:", response.data);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };
    
    React.useEffect(() => {
        fetchServices();
    }, []);

  return (
    <div>
      <h1>All Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AllServices