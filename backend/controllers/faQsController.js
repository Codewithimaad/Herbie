import FAQ from '../models/Faqs.js'

// Get all FAQs
export const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({ faqs });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add new FAQ
export const addFAQ = async (req, res) => {
    const { question, answer } = req.body;

    try {
        if (!question || !answer) {
            return res.status(400).json({ message: 'Question and answer are required' });
        }

        const faq = new FAQ({ question, answer });
        await faq.save();

        res.status(201).json({
            message: 'FAQ added successfully',
            faq,
        });
    } catch (error) {
        console.error('Error adding FAQ:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const faq = await FAQ.findByIdAndDelete(id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};