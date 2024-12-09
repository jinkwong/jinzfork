import React, { useState, useEffect } from 'react';

const StyleSheet = () => (
  <style jsx global>{`
    @keyframes twinkle {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes floatLeft {
      0% {
        opacity: 0;
        transform: translateX(-20px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes floatRight {
      0% {
        opacity: 0;
        transform: translateX(20px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes messageIn {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-twinkle {
      animation: twinkle 1.5s infinite;
    }

    .animate-float-left {
      animation: floatLeft 0.5s ease-out forwards;
    }

    .animate-float-right {
      animation: floatRight 0.5s ease-out forwards;
    }

    .animate-message-in {
      animation: messageIn 0.5s ease-out forwards;
    }

    .hover-scale {
      transition: transform 0.3s ease;
    }

    .hover-scale:hover {
      transform: scale(1.02);
    }

    .message-bubble {
      position: relative;
      transition: all 0.3s ease;
    }

    .message-bubble:hover {
      transform: translateY(-2px);
    }

    .message-bubble::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  `}</style>
);

const StarBackground = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3}px`,
    delay: `${Math.random() * 1.5}s`
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay
          }}
        />
      ))}
    </div>
  );
};

const MessageBubble = ({ isUser, children, animate }) => {
  const userClasses = isUser
    ? "bg-gradient-to-br from-blue-500 to-blue-600 ml-auto"
    : "bg-gradient-to-br from-purple-500/30 to-indigo-500/30 backdrop-blur-sm";

  return (
    <div className={`
      message-bubble
      relative max-w-[80%] rounded-2xl p-4 shadow-lg
      ${userClasses}
      ${isUser ? 'animate-float-right' : 'animate-float-left'}
      ${animate ? 'animate-message-in' : ''}
    `}>
      <div className="relative z-10">
        {typeof children === 'string' 
          ? children.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0 text-white/90">
                {line}
              </p>
            ))
          : children
        }
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [animateNext, setAnimateNext] = useState(false);

  const faqData = [
    {
      question: "事假申請流程",
      answer: "事假申請應於當日10:00AM前以電話向直屬主管請假，再轉告人事單位。\n事假連續請假2天(含)以上，需3天前提出申請。\n事假申請計算單位：以1小時為基本單位，累積計算。"
    },
    {
      question: "病假可以請幾天呢？",
      answer: "勞工因普通傷害、疾病或生理原因必須治療或休養者，得在左列規定範圍內請普通傷病假：\n• 未住院者，1年內合計不得超過30日\n• 住院者，2年內合計不得超過1年\n• 經醫師診斷，罹患癌症(含原位癌)採門診方式治療或懷孕期間需安胎休養者，其治療或休養期間，併入住院傷病假計算。"
    },
    {
      question: "事假可以請幾天？",
      answer: "因有事必須親自處理者，得請事假，1年內合計不得超過14日。"
    }
  ];

  const handleQuestionClick = (faq) => {
    setSelectedQuestion(null);
    setAnimateNext(true);
    
    setTimeout(() => {
      if (chatHistory.length >= 3) {
        setChatHistory([faq]);
      } else {
        setChatHistory([...chatHistory, faq]);
      }
      setSelectedQuestion(faq);
      setAnimateNext(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-[#000051] p-4">
      <StyleSheet />
      <StarBackground />
      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-t-lg p-4 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              ← 返回
            </button>
            <h1 className="text-lg font-medium text-white">HR客服小幫手</h1>
            <div className="ml-auto text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
              {chatHistory.length}/3 問題
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-transparent min-h-[500px] p-6 space-y-6 overflow-y-auto">
          {chatHistory.length === 0 && (
            <div className="text-center text-white/80 mb-4 animate-pulse">
              請選擇您想了解的問題
            </div>
          )}

          {chatHistory.map((faq, index) => (
            <div key={index} className="space-y-4">
              <MessageBubble isUser={true} animate={animateNext && index === chatHistory.length - 1}>
                {faq.question}
              </MessageBubble>
              <MessageBubble isUser={false} animate={animateNext && index === chatHistory.length - 1}>
                {faq.answer}
              </MessageBubble>
            </div>
          ))}

          {chatHistory.length === 3 && (
            <div className="text-center text-yellow-300 text-sm mt-4 animate-pulse">
              已達到最大問題數量，下一個問題將重新開始
            </div>
          )}
        </div>

        {/* Question Options */}
        <div className="bg-white/10 backdrop-blur-sm rounded-b-lg p-4 border-t border-white/20">
          <div className="grid gap-2">
            {faqData.map((faq, index) => (
              <button
                key={index}
                className="hover-scale w-full text-left p-4 rounded-xl
                  bg-gradient-to-r from-white/5 to-white/10
                  hover:from-white/10 hover:to-white/20
                  border border-white/20 text-white
                  transition-all duration-300 ease-in-out
                  shadow-lg hover:shadow-xl
                  backdrop-blur-sm"
                onClick={() => handleQuestionClick(faq)}
              >
                {faq.question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;