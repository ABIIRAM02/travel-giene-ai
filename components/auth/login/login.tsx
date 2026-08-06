import React from "react";
import LoginInfoCard from "./login-info-card";
import MainCard from "../common/main-card";

const Login = () => {
  return (
    <main className="grid grid-cols-2 h-screen">
      <LoginInfoCard />
      <MainCard isRegister={false} h2="Welcome back" p="Sign in to continue planning your next adventure." />
    </main>
  );
};

export default Login;
