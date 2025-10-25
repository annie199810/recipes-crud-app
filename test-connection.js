require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    
    const Test = mongoose.model('Test', new mongoose.Schema({ name: String }));
    await Test.create({ name: 'test' });
    const result = await Test.findOne({ name: 'test' });
    console.log('✅ Database operations working:', result);

    await mongoose.connection.close();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();