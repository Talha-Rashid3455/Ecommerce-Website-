import { useState, useReducer } from 'react';
import Product from './components/Product.jsx';
import Header from './components/Header.jsx';
import Shop from './components/Shop.jsx';
import { DUMMY_PRODUCTS } from './dummy-products.js';
import CartCtx from './components/CartCtx.jsx';

function shoppingCartReducer(state, action) {
  switch (action.type) {
    case 'Add_Item': {
      const updatedItems = [...state.items];
      const existingCartItemIndex = updatedItems.findIndex(
        (item) => item.id === action.id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];
      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.id);
        if (!product) {
          return state; // Return current state if product isn't found
        }
        updatedItems.push({
          id: action.id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }
      return { ...state, items: updatedItems };
    }
    case 'Update_Item': {
      const updatedItems = [...state.items];
      const itemIndex = updatedItems.findIndex(
        (item) => item.id === action.productId
      );
      if (itemIndex < 0) {
        return state; // Return current state if product isn't found
      }
      const updatedItem = {
        ...updatedItems[itemIndex],
        quantity: updatedItems[itemIndex].quantity + action.amount,
      };
      if (updatedItem.quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        updatedItems[itemIndex] = updatedItem;
      }
      return { ...state, items: updatedItems };
    }
    default:
      return state;
  }
}

function App() {
  const [shoppingCart, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'Add_Item',
      id: id
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'Update_Item',
      productId: productId,
      amount: amount
    });
  }

  let CtxVal = {
    items: shoppingCart.items, // Note: pass only the items array, not the entire shoppingCart object
    onAddToCart: handleAddItemToCart
  };

  return (
    <>
      <CartCtx.Provider value={CtxVal}>
        <Header
          cart={shoppingCart}
          onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
        />
        <Shop>
          {DUMMY_PRODUCTS.map((product) => (
            <li key={product.id}>
              <Product {...product} onAddToCart={handleAddItemToCart} />
            </li>
          ))}
        </Shop>
      </CartCtx.Provider>
    </>
  );
}

export default App;
