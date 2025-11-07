import databaseService from '@/services/database.services'
import React from 'react'
import { useParams } from 'react-router-dom';

function AllServicesByBusiness() {
    const [services, setServices] = React.useState([])

    const {businessId}=useParams();
    const fetchServices = async () => {
        try {
            const response = await databaseService.getAllServicesByBusinessId(businessId);
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
            <h2>All Services</h2>
            <ul>
                {services.map(service => (
                    <li key={service.id}>{service.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default AllServicesByBusiness