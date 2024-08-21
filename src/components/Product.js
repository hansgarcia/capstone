import axios from 'axios';
import { useState } from 'react';

function Product({ product }) {
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('You need to be logged in to add items to the cart');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/cart', {
                userId,
                productId: product.id,
                quantity,
            });
            alert('Item added to cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="product">
            <img
        src={product.image}
        alt={product.name}
        style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
      />

            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
            />
            <button onClick={addToCart}>Add to Cart</button>
        </div>
    );
}

export default Product;
