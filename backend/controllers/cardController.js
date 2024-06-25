import userModel from '../models/userModel.js'
// const addToCart=async(req,res)=>{
//   try {
//     const userData= await userModel.find({_id:req.body.userId});
//     console.log(`here is the userid ${userData} `);
//     if (!userData) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
//     const cartData=await userData.cartData;
//      if(!cartData[req.body.itemId]){
//         cartData[req.body.itemId]=1;
//      }else{
//         cartData[req.body.itemId]+=1;
//      }
//      await userModel.findByIdAndUpdate(req.body.userId,{cartData})
//      res.json({superUser:true, message:"added to cart"})
//   } catch (error) {
//      console.log(`${error} `);
//      res.status(404).json({superUser:false, message:'error'})
     
//   }
// }

// provide by the chagtGPT
const addToCart = async (req, res) => {
    try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      let cartData = userData.cartData || new Map();
  
      if (cartData instanceof Map) {
        cartData = Object.fromEntries(cartData);
      }
  
      if (!cartData[req.body.itemId]) {
        cartData[req.body.itemId] = 1;
      } else {
        cartData[req.body.itemId] += 1;
      }
  
      userData.cartData = cartData;
      await userData.save();
  
      res.json({ success: true, message: "Added to cart" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
  };
  
  const removeFromCart = async (req, res) => {
    try {
      const userData = await userModel.findById(req.body.userId);
  
      if (!userData) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      let cartData = userData.cartData || new Map();
  
      if (cartData instanceof Map) {
        cartData = Object.fromEntries(cartData);
      }
  
      if (cartData[req.body.itemId] > 0) {
        cartData[req.body.itemId] -= 1;
  
        if (cartData[req.body.itemId] === 0) {
          delete cartData[req.body.itemId];
        }
      }
  
      userData.cartData = cartData;
      await userData.save();
  
      res.json({ superUser: true, message: "Removed from cart" });
    } catch (error) {
      console.log(`Error to remove the cart: ${error}`);
      res.status(500).json({ superUser: false, message: "Error to remove from the cart" });
    }
  };
  
  
const getCart=async(req,res)=>{
 try {
    let userData= await userModel.findById(req.body.userId);
    let cartData=await userData.cartData;
    res.status(200).json({superUser:true,cartData})
 } catch (error) {
    console.log(`${error} `);
    res.status(404).json({success:false, message:'error'})
 }
}

export {addToCart,removeFromCart,getCart}