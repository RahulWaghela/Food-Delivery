import React, { useEffect, useState } from 'react';
import './list.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const List = () => {
    const baseUrl = 'http://localhost:8080';
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/food/list`);
            // console.log(response.data);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching food list");
            }
        } catch (error) {
            console.error('Error fetching food list:', error);
            toast.error('An error occurred while fetching the food list');
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${baseUrl}/api/food/remove`, { id: foodId });
            await fetchList(); // Refresh the food list after removal
    
            if (response.data.message) {
                toast.success(response.data.message);
            } else {
                toast.error('Error to Delete');
            }
        } catch (error) {
            console.error('Error removing food:', error);
            toast.error('An error occurred while removing the food');
        }
    };
      
    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <h2 style={{textAlign:'center'}}>All Food List</h2>
            <div className="list-table">
                <div className="list-table-formate title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => (
                    <div className="list-table-formate" key={index}>
                        <img src={`${baseUrl}/uploads/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>₹{item.price}</p>
                        {/* <p onClick={()=>removeFood(item._id)} className='cursor'>X</p> */}
                        <img className='cursor' onClick={()=>removeFood(item._id)} src={assets.delete_icon} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;
