// controllers/coffeeController.js
const Coffee = require("../models/coffee");

// Get all coffees
exports.getAllCoffees = async (req, res) => {
  try {
    const coffees = await Coffee.find();
    res.json({ message: "Coffees retrieved successfully", data: coffees });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving coffees", error: err.message });
  }
};

// Get coffee by ID
exports.getCoffeeById = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }
    res.json({ message: "Coffee retrieved successfully", data: coffee });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving coffee", error: err.message });
  }
};

// Create new coffee
exports.createCoffee = async (req, res) => {
  const { name, price, description, moods, zodiacSigns, image } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const coffee = new Coffee({
    name,
    price,
    description,
    moods,
    zodiacSigns,
    image
  });

  try {
    const newCoffee = await coffee.save();
    res
      .status(201)
      .json({ message: "Coffee created successfully", data: newCoffee });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating coffee", error: err.message });
  }
};

// Update coffee
exports.updateCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    const { name, price, description, moods, zodiacSigns, image } = req.body;

    if (name) coffee.name = name;
    if (price) coffee.price = price;
    if (description) coffee.description = description;
    if (moods !== undefined) coffee.moods = moods;
    if (zodiacSigns !== undefined) coffee.zodiacSigns = zodiacSigns;
    if (image) coffee.image = image;

    const updatedCoffee = await coffee.save();
    res.json({ message: "Coffee updated successfully", data: updatedCoffee });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating coffee", error: err.message });
  }
};

// Delete coffee
exports.deleteCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    await Coffee.deleteOne({ _id: req.params.id });
    res.json({ message: "Coffee deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting coffee", error: err.message });
  }
};
