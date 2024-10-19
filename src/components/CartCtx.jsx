import { createContext } from "react";


const CartCtx = createContext({
    items:[], 
    AddToCart: () => {}
  })
export default CartCtx;