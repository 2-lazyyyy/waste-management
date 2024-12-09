import ReactMarkdown from 'react-markdown';
import './Conversation.css';
import { Loader2 } from 'lucide-react';

function Conversation({conversationHistory}: {conversationHistory: { role: "user" | "model"; text: string; isLoading?: boolean }[]}) {
  return (
    <>
        
          {conversationHistory.map((message, index) => (
            <li className='text-lg' key={index}>
              <p className='text-xl font-bold '>{message.role === "user" ? "You : " : "Model : "}</p>
              <ReactMarkdown>{message.text}</ReactMarkdown>
              {message.isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <br />
            </li>
            
          ))}
    </>
  )
}

export default Conversation