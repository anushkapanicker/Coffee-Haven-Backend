// controllers/recommendationController.js
const Groq = require("groq-sdk");
const User = require("../models/user");
const Coffee = require("../models/coffee");
const Order = require("../models/order");

// Helper function to calculate zodiac sign from date of birth
const getZodiacSign = (dob) => {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius";
  return "Pisces";
};

exports.recommendCoffee = async (req, res) => {
  try {
    const { userId, mood } = req.body;

    if (!userId || !mood) {
      return res.status(400).json({ message: "User ID and mood are required" });
    }

    // Get user and their information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's zodiac sign
    const zodiacSign = getZodiacSign(user.dob);

    // Get user's previous orders with coffee details
    const previousOrders = await Order.find({ user_id: userId })
      .populate("coffee_id")
      .sort({ date: -1 })
      .limit(5);

    // Get all available coffees
    const allCoffees = await Coffee.find();

    // Format previous orders for the AI
    const orderHistory = previousOrders.map((order) => ({
      coffeeName: order.coffee_id.name,
      description: order.coffee_id.description,
      quantity: order.qty,
      date: order.date,
    }));

    // Initialize Groq client
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Create prompt for Groq API
    const prompt = `
You are a coffee recommendation expert. Recommend the best coffee from our catalog for this user.

User information:
- Zodiac sign: ${zodiacSign}
- Current mood: ${mood}
- Previous order history: ${JSON.stringify(orderHistory)}

Available coffees in our catalog:
${allCoffees
  .map(
    (coffee) => `- ${coffee.name}: ${coffee.description} (ID: ${coffee._id})`
  )
  .join("\n")}

Based on the user's mood, zodiac sign, and previous orders, recommend ONE specific coffee from our catalog that would suit them best right now. 
Return your response in JSON format with the following structure:
{
  "recommendedCoffeeId": "the MongoDB ID of the recommended coffee",
  "reasoning": "brief explanation of why this coffee is recommended"
}
`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a coffee recommendation expert." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content);

    // Get the recommended coffee from the database
    const recommendedCoffee = await Coffee.findById(
      response.recommendedCoffeeId
    );

    if (!recommendedCoffee) {
      return res.status(404).json({
        message: "Recommended coffee not found in database",
        aiResponse: response,
      });
    }

    res.json({
      message: "Coffee recommendation generated",
      recommendation: {
        coffee: recommendedCoffee,
        reasoning: response.reasoning,
      },
    });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({
      message: "Error generating coffee recommendation",
      error: err.message,
    });
  }
};
