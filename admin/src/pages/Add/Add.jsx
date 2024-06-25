import React, { useState } from 'react';
import './add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const baseUrl = "http://localhost:8080";
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Salad',
    });

    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('image', image);

        try {
            const response = await axios.post(`${baseUrl}/api/food/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Salad',
                });
                setImage(false);
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding food:', error);
            toast.error(response.data.message);
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <input onChange={onchangeHandler} value={data.name} type="text" name='name' placeholder='Product name' required />
                </div>
                <div className="add-product-description flex-col">
                    <textarea onChange={onchangeHandler} value={data.description} name="description" rows='6' placeholder='Product description' required>
                    </textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <select onChange={onchangeHandler} name="category" value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure veg">Pure veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <input onChange={onchangeHandler} value={data.price} type="number" name='price' placeholder='Product Price' required />
                    </div>
                </div>
                <button type='submit' className='add-btn'>Add</button>
            </form>
        </div>
    );
};

export default Add;
