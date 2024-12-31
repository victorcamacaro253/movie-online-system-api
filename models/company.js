import { Schema, model } from "mongoose";

// Define the schema for the company's headquarters
const headquartersSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  country: { type: String, required: true },
});

// Define the schema for the organizational chart
const organizationalChartSchema = new Schema({
  president: { type: String, required: true },
  manager: { type: String, required: true },
});

// Define the schema for social media accounts
const socialMediaSchema = new Schema({
  instagram: {
    username: { type: String, required: true },
    password: { type: String, required: true }, // Consider hashing passwords for security
  },
  tiktok: {
    username: { type: String, required: true },
    password: { type: String, required: true }, // Consider hashing passwords for security
  },
});

// Define the main company schema
const companySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    headquarters: { type: headquartersSchema, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    total_theaters: { type: Number, required: true },
    total_employees: { type: Number, required: true },
    organizational_chart: { type: organizationalChartSchema, required: true },
    social_media: { type: socialMediaSchema, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Company model
const Company = model("company", companySchema);

export default Company;