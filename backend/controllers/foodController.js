import foodModel from '../models/food_model.js'
import fs from 'fs'


const addFood = async (req, res) => {
    try {
        let image_filename=`${req.file.filename}`;
        const food= new foodModel({
           name: req.body.name,
           price: req.body.price,
           description: req.body.description,
           image: image_filename, 
           category: req.body.category
           })
      await food.save()        
      res.status(200).json({ success: true, message: 'Food added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }

}

const listfood = async(req,res)=>{
  try {
    const food= await foodModel.find({});
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error(`Error fetching food list: ${error.message}`, error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching the food list' });
  }
}
const removeFood=async(req,res)=>{
  try {
    const food= await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})
    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({sucess:true, message:"food removed successfully"})
    } catch (error) {
        console.log(`${error} `);
        res.status(500).json({sucess:false, message:"error"})
  }
}
export { addFood, listfood ,removeFood} 