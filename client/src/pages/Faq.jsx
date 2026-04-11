import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Chip,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqData = [
  {
    id: 1,
    category: "General",
    question: "What is Samraddh Bharat?",
    answer: "Samraddh Bharat is a digital platform dedicated to supporting education, skill development, and holistic growth for individuals across India. We provide resources, courses, and community support to help people achieve their full potential.",
  },
  {
    id: 2,
    category: "General",
    question: "What is the mission of Samraddh Bharat?",
    answer: "Our mission is to empower every individual with accessible education and development opportunities, bridging the gap between aspirations and achievements, especially in underserved communities.",
  },
  {
    id: 3,
    category: "Account",
    question: "How can I register on Samraddh Bharat?",
    answer: "You can register by clicking on the 'Sign Up' button on the login page. You'll need to provide your name, email address, and create a password.",
  },
  {
    id: 4,
    category: "Account",
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
  },
  {
    id: 5,
    category: "Account",
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account by going to Settings > Account > Delete Account. Please note that this action is permanent and will remove all your data, including course progress and certificates.",
  },
  {
    id: 6,
    category: "Payment",
    question: "Is Samraddh Bharat free to use?",
    answer: "Basic features including access to free courses, community forums, and basic learning resources are completely free. Premium courses, advanced certifications, and personalized mentoring are available for a fee.",
  },
  {
    id: 7,
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods including credit/debit cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm), net banking, and EMI options on select premium courses.",
  },
  {
    id: 8,
    category: "Payment",
    question: "Can I get a refund for a course I purchased?",
    answer: "Yes, we offer a 7-day refund policy for premium courses if you've completed less than 20% of the course content. To request a refund, contact our support team at support@samraddhbharat.com within 7 days of purchase.",
  },
  {
    id: 9,
    category: "Courses",
    question: "What types of courses are available?",
    answer: "We offer courses in various categories including Digital Skills (Web Development, Data Science, AI), Professional Development (Communication, Leadership), Academic Support (Mathematics, Science), Vocational Training (Crafts, Agriculture), and Competitive Exam Preparation.",
  },
  {
    id: 10,
    category: "Courses",
    question: "How do I enroll in a course?",
    answer: "Browse our course catalog, click on the course you're interested in, and click the 'Enroll Now' button. Free courses will be added immediately to your dashboard. For premium courses, you'll be directed to the payment page.",
  },
  {
    id: 11,
    category: "Courses",
    question: "Will I receive a certificate after completing a course?",
    answer: "Yes, upon successful completion of any course (free or premium), you'll receive a digital certificate. Premium courses include a verified certificate with a unique ID that can be shared on LinkedIn or added to your resume.",
  },
  {
    id: 12,
    category: "Courses",
    question: "Can I access courses on mobile devices?",
    answer: "Absolutely! Our platform is fully responsive and works seamlessly on smartphones and tablets. We also have a dedicated mobile app available for download on both Android (Google Play Store) and iOS (App Store).",
  },
  {
    id: 13,
    category: "Technical Support",
    question: "I'm having trouble loading videos. What should I do?",
    answer: "Please check your internet connection first. If the issue persists, try clearing your browser cache, using a different browser, or switching to a different network. You can also download course videos for offline viewing in our mobile app.",
  },
  {
    id: 14,
    category: "Technical Support",
    question: "How do I contact customer support?",
    answer: "You can reach our support team via email at support@samraddhbharat.com, through the live chat feature on our website (available 9 AM to 9 PM IST), or by submitting a ticket through your dashboard under 'Help & Support'.",
  },
  {
    id: 15,
    category: "Community",
    question: "Is there a community forum for learners?",
    answer: "Yes, we have an active community forum where learners can ask questions, share resources, participate in discussions, and network with peers. You can access it from your dashboard under the 'Community' tab.",
  },
  {
    id: 16,
    category: "Community",
    question: "Can I become a mentor on Samraddh Bharat?",
    answer: "Yes, we're always looking for passionate mentors! If you have expertise in any field and want to guide learners, please apply through our 'Become a Mentor' page. You'll need to submit your credentials and go through a brief verification process.",
  },
  {
    id: 17,
    category: "General",
    question: "Does Samraddh Bharat offer scholarships?",
    answer: "Yes, we offer need-based and merit-based scholarships for premium courses. Eligible learners can apply through the 'Scholarships' section in their dashboard. Applications are reviewed monthly.",
  },
  {
    id: 18,
    category: "Account",
    question: "How can I update my profile information?",
    answer: "Log in to your account, go to 'My Profile' from the dashboard, and click on 'Edit Profile'. You can update your name, profile picture, contact information, and areas of interest. Don't forget to save your changes.",
  },
];

function Faq() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState([]);

  const categories = ["All", ...new Set(faqData.map((f) => f.category))];

  const handleToggle = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredData = faqData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box maxWidth="900px" mx="auto" p={3}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Frequently Asked Questions
      </Typography>

      {/* Search Field */}
      <TextField
        fullWidth
        label="Search FAQs..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="e.g., registration, payment, certificate..."
      />

      {/* Category Filters */}
      <Box mb={3} display="flex" gap={1} flexWrap="wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "filled" : "outlined"}
          />
        ))}
      </Box>

      {/* FAQ List */}
      {filteredData.map((item) => (
        <Accordion
          key={item.id}
          expanded={expanded.includes(item.id)}
          onChange={() => handleToggle(item.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" variant="subtitle1">
              {item.question}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {filteredData.length === 0 && (
        <Typography textAlign="center" mt={3} color="text.secondary">
          No FAQs found matching your search criteria 😔
          <br />
          Try using different keywords or browse by category.
        </Typography>
      )}
    </Box>
  );
}

export default Faq;