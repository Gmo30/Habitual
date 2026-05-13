import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user, error, habits, toggleHabit, isCompletedToday }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {error && <p className="text-red-500 mb-4 text-sm bg-white p-2 rounded">{error}</p>}

      {user ? (
        /* --- LOGGED IN VIEW --- */
        <>

          <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Welcome, {user.username}</h2>
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
                    <button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={() => toggleHabit(habit._id)}
                    >
                      {isCompletedToday(habit) ? "✅ Completed today" : "Mark as completed"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* --- LOGGED OUT VIEW --- */
        <div className="bg-[linear-gradient(to_right,rgb(250,252,253),rgb(184,218,236),rgb(157,228,183))] flex flex-col items-center justify-center w-full min-h-[100vh] text-center px-4">

          <h1 className="text-6xl font-bold">
            Welcome to Habitual
          </h1>

          <p className="text-5xl text-gray-600 mb-10">
            Track habits, stay organized, and build consistency.
          </p>

          <Link
            to="/register"
            className="bg-blue-500 text-white mt-6 md-10 px-6 py-3 rounded-2xl hover:bg-blue-600 font-medium"
          >
            Get Started
          </Link>

          <div className="flex justify-center mt-10">
            <div className="flex flex-wrap justify-center gap-8 max-w-5xl w-full px-4">
              <div className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                <img src="https://cdn.pixabay.com/photo/2015/08/26/18/20/info-908889_960_720.png"
                  className="w-30 h-30 object-contain mb-3" />
                <p className="text-center text-gray-600">
                  Organize your habits easily
                </p>
              </div>

              <div className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                <img src="https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331258_1280.png"
                  className="w-30 h-30 object-contain mb-3" />
                <p className="text-center text-gray-600">
                  Make friends and find community
                </p>
              </div>

              <div className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                <img src="https://cdn.pixabay.com/photo/2024/11/20/08/53/checklist-9210780_1280.png"
                  className="w-30 h-30 object-contain mb-3" />
                <p className="text-center text-gray-600">
                  Track progress daily
                </p>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default Dashboard;