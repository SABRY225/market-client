import React from 'react';

const LoginForm = ({ title, colorClass, backgroundImage, animationClass }) => {
  return (
    <div
      className={` ${animationClass}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-80">
        {/* العنوان المخصص */}
        <h2 className={`text-3xl font-bold text-center mb-6 text-${colorClass}-600`}>
          تسجيل دخول {title}
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); alert(`محاولة تسجيل دخول لـ ${title}`); }}>
          {/* حقل البريد الإلكتروني */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@domain.com"
              required
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* زر تسجيل الدخول المخصص باللون مع تأثير */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`w-full bg-${colorClass}-500 hover:bg-${colorClass}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 active:scale-95`}
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;