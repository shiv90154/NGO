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
    answer: "Yeh ek digital platform hai jo education aur development ko support karta hai.",
  },
  {
    id: 2,
    category: "Account",
    question: "How can I register?",
    answer: "Aap login page se signup kar sakte ho.",
  },
  {
    id: 3,
    category: "Payment",
    question: "Is this platform free?",
    answer: "Basic features free hain, premium paid ho sakte hain.",
  },
  {
    id: 4,
    category: "Account",
    question: "How to reset password?",
    answer: "Forgot password option use karo.",
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
    return (
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.question.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box maxWidth="800px" mx="auto" p={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        FAQ Section
      </Typography>

      {/* 🔍 Search */}
      <TextField
        fullWidth
        label="Search FAQs..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* 🏷 Category Filter */}
      <Box mb={2} display="flex" gap={1} flexWrap="wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCategory === cat ? "primary" : "default"}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </Box>

      {/* 📂 FAQ List */}
      {filteredData.map((item) => (
        <Accordion
          key={item.id}
          expanded={expanded.includes(item.id)}
          onChange={() => handleToggle(item.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{item.question}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {filteredData.length === 0 && (
        <Typography textAlign="center" mt={3}>
          No FAQs found 😔
        </Typography>
      )}
    </Box>
  );
}

export default Faq;