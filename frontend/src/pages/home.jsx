import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = ({ user, error, habits }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* {error && <p className="text-red-500 mb-4 text-sm bg-white p-2 rounded">{error}</p>} */}
      
      {user ? (
        /* --- LOGGED IN VIEW --- */
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome, {user.username}
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Habits</h2>
            {/* Added optional chaining (habits?) just in case habits is undefined on load */}
            {habits?.length === 0 ? (
              <p>No active habits. Add some from the Navbar!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits?.map((habit) => (
                  <div key={habit._id} className="p-4 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-semibold text-emerald-600">{habit.name}</h2>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* --- LOGGED OUT VIEW --- */
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome!</h2>
          <p className="text-xl font-medium mb-6 text-gray-600">
            Please log in or register to track your habits.
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              className="w-full block text-center bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="w-full block text-center bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 font-medium"
              to="/register"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;