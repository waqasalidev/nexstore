import SupportTicket from "../models/SupportTicket.js";
import { generateAIResponse } from "../utils/gemini.js";

// @desc    Get all support tickets for logged in user
// @route   GET /api/support
// @access  Private
export const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    
    const formatted = tickets.map(t => {
      const tJson = t.toJSON();
      return {
        ...tJson,
        id: t._id.toString()
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
export const createTicket = async (req, res) => {
  const { subject, category, message } = req.body;

  if (!subject || !category || !message) {
    return res.status(400).json({ message: "Subject, category, and message are required." });
  }

  try {
    const ticket = await SupportTicket.create({
      user_id: req.user._id,
      subject,
      category,
      message,
      status: "open",
      replies: []
    });

    // Auto-respond with Gemini AI on ticket creation
    setTimeout(async () => {
      try {
        const t = await SupportTicket.findById(ticket._id);
        if (t && t.status === "open") {
          const systemInstruction = "You are the NexStore AI Customer Support Agent. Write a helpful, professional, and empathetic initial response acknowledging the customer's new support ticket. Keep it highly relevant to their ticket message, category, and subject. Keep it under 4 sentences.";
          const prompt = `New Support Ticket:\nSubject: ${t.subject}\nCategory: ${t.category}\nMessage: ${t.message}`;
          
          const aiResponse = await generateAIResponse(prompt, systemInstruction);
          
          t.replies.push({
            sender: "admin",
            message: aiResponse || `Thank you for opening a support ticket regarding "${t.subject}". Our support desk has received your request, and a representative will get back to you shortly.`
          });
          t.status = "replied";
          await t.save();
        }
      } catch (err) {
        console.error("Auto reply on ticket creation failed:", err);
      }
    }, 2000);

    res.status(201).json({
      ...ticket.toJSON(),
      id: ticket._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a support ticket
// @route   POST /api/support/:id/reply
// @access  Private
export const replyToTicket = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message reply cannot be empty." });
  }

  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    if (ticket.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this ticket" });
    }

    // Push new reply
    ticket.replies.push({
      sender: "user",
      message: message.trim()
    });

    ticket.status = "open"; // reset status on customer message
    const updated = await ticket.save();

    // Auto-respond with Gemini AI on customer reply
    setTimeout(async () => {
      try {
        const t = await SupportTicket.findById(ticket._id);
        if (t && t.status === "open") {
          const systemInstruction = "You are the NexStore AI Customer Support Agent. Write a professional, concise, and helpful response to the customer's latest reply. Utilize the conversation log to keep context. Keep the answer under 4 sentences.";
          const prompt = `Ticket Context:\nSubject: ${t.subject}\nCategory: ${t.category}\nOriginal Message: ${t.message}\n\nDiscussion History:\n${t.replies.map(r => `${r.sender === "admin" ? "Agent" : "Customer"}: ${r.message}`).join("\n")}`;
          
          const aiResponse = await generateAIResponse(prompt, systemInstruction);
          
          t.replies.push({
            sender: "admin",
            message: aiResponse || "Thank you for reaching out. A support representative will review your response and contact you shortly."
          });
          t.status = "replied";
          await t.save();
        }
      } catch (err) {
        console.error("Auto reply simulation failed:", err);
      }
    }, 2000);

    res.json({
      ...updated.toJSON(),
      id: updated._id.toString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
