import axios from 'axios';
import { useState, useEffect } from 'react';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to be logged in to view the cart');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5001/api/cart', {
                    params: { userId }
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.map(item => (
                <div key={item.productId} className="cart-item">
                    <p>Product ID: {item.productId}</p>
                    <p>Quantity: {item.quantity}</p>
                </div>
            ))}
        </div>
    );
}

export default Cart;
