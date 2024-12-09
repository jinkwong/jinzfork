import React, { useState, useEffect } from 'react';
import { Globe, ArrowLeft } from 'lucide-react';

const StyleSheet = () => (
  <style jsx global>{`
    @keyframes twinkle {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes shooting-star {
      0% {
        transform: translateX(0) translateY(0) rotate(-45deg);
        opacity: 1;
      }
      100% {
        transform: translateX(-500px) translateY(500px) rotate(-45deg);
        opacity: 0;
      }
    }

    .animate-twinkle {
      animation: twinkle 1.5s infinite;
    }

    .animate-shooting-star {
      animation: shooting-star 2s linear infinite;
    }
  `}</style>
);

const StarBackground = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: `star-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
    setStars(newStars);

    const shootingStarInterval = setInterval(() => {
      const newShootingStar = {
        id: `shooting-${Date.now()}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 50}%`
      };
      
      setShootingStars(prev => [...prev, newShootingStar]);
      
      setTimeout(() => {
        setShootingStars(prev => 
          prev.filter(star => star.id !== newShootingStar.id)
        );
      }, 2000);
    }, 4000);

    return () => clearInterval(shootingStarInterval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: star.left,
            top: star.top
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]" />
        </div>
      ))}
    </div>
  );
};

const MessageBubble = ({ isUser, children, animate }) => {
  const userClasses = isUser
    ? "bg-gradient-to-br from-blue-500 to-blue-600 ml-auto"
    : "bg-gradient-to-br from-purple-500/30 to-indigo-500/30 backdrop-blur-sm";

  const animationClasses = `
    message-bubble
    relative max-w-[80%] rounded-2xl p-4 shadow-lg
    ${userClasses}
    ${isUser ? 'animate-float-right' : 'animate-float-left'}
    ${animate ? 'animate-message-in' : ''}
  `;

  return (
    <div 
      className={animationClasses}
      role={isUser ? "complementary" : "article"}
      aria-label={isUser ? "您的問題" : "系統回答"}
    >
      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="flex-1">
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
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="text-center p-4 text-red-300">
        很抱歉，發生了一些錯誤。請重新整理頁面。
      </div>
    );
  }

  return children;
};

const FAQPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [animateNext, setAnimateNext] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  const faqData = {
    zh: [
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
    ],
    en: [
      {
        question: "Personal Leave Application Process",
        answer: "Please notify your direct supervisor by phone before 10:00 AM on the day of leave, then inform HR.\nFor consecutive personal leave of 2 or more days, application must be submitted 3 days in advance.\nLeave is calculated in hours as the basic unit."
      },
      {
        question: "How many days of sick leave can I take?",
        answer: "For regular injuries, illness, or physiological reasons requiring treatment or rest:\n• Non-hospitalization: Up to 30 days per year\n• Hospitalization: Up to 1 year within 2 years\n• Cancer treatment (including carcinoma in situ) or pregnancy bed rest: Counted as hospitalization leave."
      },
      {
        question: "How many days of personal leave are allowed?",
        answer: "For matters requiring personal handling, you may take personal leave up to 14 days per year."
      }
    ]
  };

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

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'zh' ? 'en' : 'zh');
    setChatHistory([]);
    setSelectedQuestion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-[#000051] p-4">
      <StyleSheet />
      <StarBackground />
      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-t-lg p-4 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <button 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label="返回"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium text-white">
              {currentLanguage === 'zh' ? 'HR客服小幫手' : 'HR Assistant'}
            </h1>
            <button
              onClick={toggleLanguage}
              className="ml-auto flex items-center space-x-2 text-white/70 hover:text-white/90 transition-colors"
              aria-label="切換語言"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">{currentLanguage.toUpperCase()}</span>
            </button>
            <div className="text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
              {chatHistory.length}/3
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="bg-transparent min-h-[500px] p-6 space-y-6 overflow-y-auto"
          role="log"
          aria-live="polite"
        >
          {chatHistory.length === 0 && (
            <div className="text-center text-white/80 mb-4 animate-pulse">
              {currentLanguage === 'zh' 
                ? '請選擇您想了解的問題'
                : 'Please select a question'
              }
            </div>
          )}

          {chatHistory.map((faq, index) => (
            <div key={index} className="space-y-4">
              <MessageBubble 
                isUser={true} 
                animate={animateNext && index === chatHistory.length - 1}
              >
                {faq.question}
              </MessageBubble>
              <MessageBubble 
                isUser={false} 
                animate={animateNext && index === chatHistory.length - 1}
              >
                {faq.answer}
              </MessageBubble>
            </div>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-b-lg p-4 space-y-2">
          {faqData[currentLanguage].map((faq, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(faq)}
              className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 
                       transition-colors text-white/90 hover:text-white hover-scale"
              disabled={chatHistory.length >= 3 && !selectedQuestion}
            >
              {faq.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;