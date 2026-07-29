import Link from "next/link";
import React from "react";

const Navbar = ( {isRegister} : {isRegister : boolean} ) => {
  return (
    <main className="py-4" >
      <div className="flex justify-between items-center" >
        <p>TravelGenie</p>
        {isRegister ? <p>
          Have account? <Link href='/login' className="text-blue-500">Sign in</Link>
        </p> : <p>
          New to TravelGenie? <Link href='/register' className="text-blue-500">Create an account</Link>
        </p>}
      </div>
    </main>
  );
};

export default Navbar;
