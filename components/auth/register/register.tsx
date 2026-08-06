import MainCard from "../common/main-card";
import RegisterInfocard from "./register-info-card";

const Register = () => {
  return (
    <main className="grid grid-cols-2 h-screen" >
        <RegisterInfocard />
        <MainCard isRegister={true} h2="Create your account" p="Free forever. No credit card required." />
    </main>
  );
};

export default Register;
