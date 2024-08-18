"use client";
import { FC, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Define the schema using Zod
const messageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(500, "Message cannot exceed 500 characters");

interface Custombutton {}

const MessageComponent: FC<Custombutton> = ({}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    const result = messageSchema.safeParse(message);

    if (!result.success) {
      setLoading(false);
      setError(result.error.errors[0].message);
      toast.error(result.error.errors[0].message);
      return;
    }

    try {
      const res = await axios.post("/api/slack", { message });
      toast.success("Message sent successfully!");
      console.log(res.data);
      setMessage("");
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message!");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* Input field for message */}
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError(null);
        }}
        placeholder="Type your message"
        className={`mb-2 p-2 w-[40%] h-[30%] border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded bg-slate-900`}
      />
      
      <button
        onClick={handleClick}
        className="p-2 w-[20%] flex justify-center bg-blue-500 text-white rounded"
      >
        {loading ? (
          <Loader2 className="h-6 w-6  animate-spin" />
        ) : (
          "Send Message"
        )}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MessageComponent;