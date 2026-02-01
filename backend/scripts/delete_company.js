const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/Company');

dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobconnect';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const companyName = 'Saikiran'; // Target company

        try {
            // Delete ALL matching companies
            const result = await Company.deleteMany({ name: new RegExp(companyName, 'i') });

            if (result.deletedCount === 0) {
                console.log(`No companies found with name '${companyName}'.`);
            } else {
                console.log(`Successfully deleted ${result.deletedCount} company/companies with name: ${companyName}`);
            }
        } catch (err) {
            console.error('Error deleting company:', err);
        } finally {
            mongoose.disconnect();
            console.log('Disconnected');
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
