import Navbar from "@/components/navigation-bar";
import RegisterForm from "../register/register-form";
import Oauth from "./Oauth-login";
import Loginform from "../login/login-form";

interface maincard {
    isRegister? : boolean
    h2 : string
    p : string
}

const MainCard = ({ isRegister, h2, p }: maincard) => {

  return (
    <main className="px-16 flex flex-col">
      <Navbar isRegister={isRegister} />
      <section className="px-24 flex flex-1 flex-col justify-evenly mt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-poppins font-medium">{h2}</h2>
          <p>{p}</p>

          <Oauth />

          {isRegister ? <RegisterForm /> : <Loginform />}
        </div>

        <span className="text-xs fixed bottom-7 ml-24">
          © 2026 TravelGenie AI. All rights reserved.
        </span>
      </section>
    </main>
  );

};

export default MainCard;
